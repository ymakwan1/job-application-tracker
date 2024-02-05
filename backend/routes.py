import logging
from flask import jsonify, request
from models import db, Job, ApplicationStatus
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError
import pytz
from datetime import datetime


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def validate_job_data(data):
    required_keys = ['jobId', 'title', 'company', 'jobType', 'jobPostingUrl', 'dashboardUrl', 'jobPostingSource', 'dateApplied', 'referral', 'referrerName']
    data_keys_list = list(data.keys())

    if data_keys_list == required_keys:
        return True
    else:
        return False

def init_routes(app):
    @app.route('/api/jobs', methods=['POST'])
    @cross_origin()
    def add_job():
        try:
            data = request.get_json()

            # Validate job data
            if not validate_job_data(data):
                error_msg = 'Invalid job data provided. Required keys: {}'.format(', '.join(required_keys))
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 400

            job_id = data['jobId']

            # Check if job_id already exists
            if Job.query.filter_by(job_id=job_id).first():
                error_msg = 'Job with Job ID "{}" already exists'.format(job_id)
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 400

            est_timezone = pytz.timezone('America/New_York')
            est_now = datetime.now(est_timezone)
            est_date = est_now.date()

            new_job = Job(
                job_id=job_id,
                title=data['title'],
                company=data['company'],
                job_type=data['jobType'],
                job_posting_url=data['jobPostingUrl'],
                dashboard_url=data['dashboardUrl'],
                job_posting_source=data['jobPostingSource'],
                date_applied=est_date,
                referral=data['referral'],
                referrer_name=data['referrerName'] if data['referral'] else None,
                application_status=ApplicationStatus.APPLIED
            )

            db.session.add(new_job)
            db.session.commit()

            success_msg = 'Job added successfully'
            logger.info(success_msg)
            return jsonify({'message': success_msg}), 201
        except IntegrityError as e:
            db.session.rollback()
            error_msg = 'IntegrityError: {}'.format(str(e))
            logger.error(error_msg)
            return jsonify({'error': error_msg}), 400
        except Exception as e:
            logger.exception('An error occurred while adding a job')
            return jsonify({'error': 'An error occurred while adding a job'}), 500

    @app.route('/api/show_jobs', methods=['GET'])
    @cross_origin()
    def show_jobs():
        try:
            search_term = request.args.get('search', default='', type=str)
            status_filter = request.args.get('status', default='', type=str)

            query = Job.query

            if search_term:
                query = query.filter(
                    (Job.title.ilike(f"%{search_term}%")) | 
                    (Job.company.ilike(f"%{search_term}%"))
                )
            if status_filter:
                query = query.filter(Job.application_status == ApplicationStatus(status_filter))

            jobs = query.all()
            
            job_list = []

            for job in jobs:
                job_details = {
                    'job_id': job.job_id,
                    'title': job.title,
                    'company': job.company,
                    'job_type': job.job_type,
                    'job_posting_url': job.job_posting_url,
                    'dashboard_url': job.dashboard_url,
                    'job_posting_source': job.job_posting_source,
                    'referral': job.referral,
                    'referrer_name': job.referrer_name,
                    'application_status': job.application_status.value
                }

                if job.application_status == ApplicationStatus.APPLIED:
                    date_applied = job.date_applied
                    counter_days = (datetime.now().date() - date_applied).days
                    job_details['counter_days'] = counter_days
                    job_details['date'] = job.date_applied.isoformat()
                elif job.application_status == ApplicationStatus.OA_RECEIVED:
                    job_details['date'] = job.date_oa_received.isoformat()
                elif job.application_status == ApplicationStatus.TECH_INTERVIEW:
                    job_details['date'] = job.date_tech_interview.isoformat()
                elif job.application_status == ApplicationStatus.REJECTED:
                    job_details['date'] = job.date_rejected.isoformat()
                elif job.application_status == ApplicationStatus.ACCEPTED:
                    job_details['date'] = job.date_accepted.isoformat()

                job_list.append(job_details)

            success_msg = 'Jobs fetched successfully'
            logger.info(success_msg)
            return jsonify({'jobs': job_list}), 200
        except Exception as e:
            logger.exception('An error occurred while fetching jobs')
            return jsonify({'error': 'An error occurred while fetching jobs'}), 500

    @app.route('/api/delete_job/<string:job_id>', methods=['DELETE'])
    @cross_origin()
    def delete_job(job_id):
        try:
            job = Job.query.filter_by(job_id=job_id).first()

            if job:
                db.session.delete(job)
                db.session.commit()
                success_msg = 'Job deleted successfully'
                logger.info(success_msg)
                return jsonify({'message': success_msg}), 200
            else:
                error_msg = 'Job with Job ID "{}" not found'.format(job_id)
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 404
        except Exception as e:
            logger.exception('An error occurred while deleting a job')
            return jsonify({'error': 'An error occurred while deleting a job'}), 500

    @app.route('/api/update_status/<string:job_id>', methods=['PUT'])
    @cross_origin()
    def update_status(job_id):
        try:
            data = request.get_json()
            new_status = data.get('newStatus')

            job = Job.query.filter_by(job_id=job_id).first()

            if job:
                if new_status and new_status in [status.value for status in ApplicationStatus]:
                    job.application_status = ApplicationStatus(new_status)
                    current_time = datetime.now()
                    est_timezone = pytz.timezone('America/New_York')
                    current_est_time = current_time.astimezone(est_timezone).date()

                    if new_status == ApplicationStatus.OA_RECEIVED.value:
                        job.date_oa_received = current_est_time
                    elif new_status == ApplicationStatus.TECH_INTERVIEW.value:
                        job.date_tech_interview = current_est_time
                    elif new_status == ApplicationStatus.REJECTED.value:
                        job.date_rejected = current_est_time
                    elif new_status == ApplicationStatus.ACCEPTED.value:
                        job.date_accepted = current_est_time
                        
                    db.session.commit()
                    success_msg = 'Job status updated successfully'
                    logger.info(success_msg)
                    return jsonify({'message': success_msg}), 200
                else:
                    error_msg = 'Invalid status provided'
                    logger.error(error_msg)
                    return jsonify({'error': error_msg}), 400
            else:
                error_msg = 'Job with Job ID "{}" not found'.format(job_id)
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 404
        except Exception as e:
            logger.exception('An error occurred while updating job status')
            return jsonify({'error': 'An error occurred while updating job status'}), 500

    @app.route('/api/analytics/', methods=['GET'])
    @cross_origin()
    def total_jobs_analytics():
        try:
            total_jobs = Job.query.count()
            total_rejected_jobs = Job.query.filter_by(application_status=ApplicationStatus.REJECTED).count()
            total_oa = Job.query.filter_by(application_status=ApplicationStatus.OA_RECEIVED).count()
            total_tech_interview = Job.query.filter_by(application_status=ApplicationStatus.TECH_INTERVIEW).count()
            total_accepted = Job.query.filter_by(application_status=ApplicationStatus.ACCEPTED).count()

            daily_job_applications = (
                db.session.query(
                    db.func.date_trunc('day', Job.date_applied).label('date'),
                    db.func.count().label('applications')
                )
                .group_by(db.func.date_trunc('day', Job.date_applied))
                .all()
            )

            daily_job_applications_list = [
                {
                    'date': result.date.date().isoformat(),
                    'applications': result.applications
                } for result in daily_job_applications
            ]

            success_msg = 'Job analytics fetched successfully'
            logger.info(success_msg)
            return jsonify({
                'totalJobs': total_jobs,
                'totalRejectedJobs': total_rejected_jobs,
                'totalOAReceived': total_oa,
                'totalTechInterviewReceived': total_tech_interview,
                'totalAcceptedJobs': total_accepted,
                'dailyJobApplications': daily_job_applications_list
            }), 200
        except Exception as e:
            logger.exception('An error occurred while fetching job analytics')
            return jsonify({'error': 'An error occurred while fetching job analytics'}), 500

    @app.route('/api/job_details/<string:job_id>', methods=['GET'])
    @cross_origin()
    def get_job_details(job_id):
        try:
            job = Job.query.filter_by(job_id=job_id).first()

            if job:
                job_details = {
                    'job_id': job.job_id,
                    'title': job.title,
                    'company': job.company,
                    'job_type': job.job_type,
                    'job_posting_url': job.job_posting_url,
                    'dashboard_url': job.dashboard_url,
                    'job_posting_source': job.job_posting_source,
                    'referral': job.referral,
                    'referrer_name': job.referrer_name,
                    'application_status': job.application_status.value
                }

                if job.application_status == ApplicationStatus.APPLIED:
                    job_details['date'] = job.date_applied.isoformat()
                elif job.application_status == ApplicationStatus.OA_RECEIVED:
                    job_details['date'] = job.date_oa_received.isoformat()
                elif job.application_status == ApplicationStatus.TECH_INTERVIEW:
                    job_details['date'] = job.date_tech_interview.isoformat()
                elif job.application_status == ApplicationStatus.REJECTED:
                    job_details['date'] = job.date_rejected.isoformat()
                elif job.application_status == ApplicationStatus.ACCEPTED:
                    job_details['date'] = job.date_accepted.isoformat()

                success_msg = 'Job details fetched successfully'
                logger.info(success_msg)
                return jsonify({'jobDetails': job_details}), 200
            else:
                error_msg = 'Job with Job ID "{}" not found'.format(job_id)
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 404
        except Exception as e:
            logger.exception('An error occurred while fetching job details')
            return jsonify({'error': 'An error occurred while fetching job details'}), 500
        
    @app.route('/api/update_job/<string:job_id>', methods=['PUT'])
    @cross_origin()
    def update_job(job_id):
        try:
            data = request.get_json()

            job = Job.query.filter_by(job_id=job_id).first()

            if job:
                job.job_id = data.get('jobId', job.job_id)
                job.title = data.get('title', job.title)
                job.company = data.get('company', job.company)
                job.job_type = data.get('jobType', job.job_type)
                job.job_posting_url = data.get('jobPostingUrl', job.job_posting_url)
                job.dashboard_url = data.get('dashboardUrl', job.dashboard_url)
                job.job_posting_source = data.get('jobPostingSource', job.job_posting_source)
                job.referral = data.get('referral', job.referral)
                job.referrer_name = data.get('referrerName', job.referrer_name)

                new_status = data.get('application_status')
                new_date_str = data.get('date')
                #print(new_date)
                if new_status and new_status in [status.value for status in ApplicationStatus]:
                    job.application_status = ApplicationStatus(new_status)

                    est = pytz.timezone('EST')
                    new_date = datetime.strptime(new_date_str, '%Y-%m-%d').replace(tzinfo=est)

                    if new_status == ApplicationStatus.APPLIED.value:
                        job.date_applied = new_date
                    elif new_status == ApplicationStatus.OA_RECEIVED.value:
                        job.date_oa_received = new_date
                    elif new_status == ApplicationStatus.TECH_INTERVIEW.value:
                        job.date_tech_interview = new_date
                    elif new_status == ApplicationStatus.REJECTED.value:
                        job.date_rejected = new_date
                    elif new_status == ApplicationStatus.ACCEPTED.value:
                        job.date_accepted = new_date
                
                
                db.session.commit()
                success_msg = 'Job details updated successfully'
                logger.info(success_msg)
                return jsonify({'message': success_msg}), 200
            else:
                error_msg = 'Job with Job ID "{}" not found'.format(job_id)
                logger.error(error_msg)
                return jsonify({'error': error_msg}), 404
        except Exception as e:
            logger.exception('An error occurred while updating job details')
            return jsonify({'error': 'An error occurred while updating job details'}), 500
