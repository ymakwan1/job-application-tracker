# backend/routes.py
from flask import jsonify, request
from models import db, Job, ApplicationStatus
from flask_cors import cross_origin
from sqlalchemy.exc import IntegrityError

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
                return jsonify({'error': 'Invalid job data provided'}), 400

            job_id = data['jobId']

            # Check if job_id already exists
            if Job.query.filter_by(job_id=job_id).first():
                return jsonify({'error': f'Job with Job ID : {job_id} already exists'}), 400

            new_job = Job(
                job_id=job_id,
                title=data['title'],
                company=data['company'],
                job_type=data['jobType'],
                job_posting_url=data['jobPostingUrl'],
                dashboard_url=data['dashboardUrl'],
                job_posting_source=data['jobPostingSource'],
                date_applied=data['dateApplied'],
                referral=data['referral'],
                referrer_name=data['referrerName'] if data['referral'] else None,
                application_status=ApplicationStatus.APPLIED
            )

            db.session.add(new_job)
            db.session.commit()

            return jsonify({'message': 'Job added successfully'}), 201
        except IntegrityError as e:
            db.session.rollback()
            return jsonify({'error': f'IntegrityError: {str(e)}'}), 400
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500

    
    @app.route('/api/companies', methods=['GET'])
    @cross_origin()
    def get_companies():
        try:
            companies = Job.query.with_entities(Job.company).distinct().all()
            company_names = [company[0] for company in companies]
            return jsonify({'companies': company_names}), 200
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
    @app.route('/api/show_jobs', methods=['GET'])
    @cross_origin()
    def show_jobs():
        try:
            jobs = Job.query.all()

            job_list = [
                {
                    'job_id': job.job_id,
                    'title': job.title,
                    'company': job.company,
                    'job_type': job.job_type,
                    'job_posting_url': job.job_posting_url,
                    'dashboard_url': job.dashboard_url,
                    'job_posting_source': job.job_posting_source,
                    'date_applied': job.date_applied.isoformat(),
                    'referral': job.referral,
                    'referrer_name': job.referrer_name,
                    'application_status': job.application_status.value
                } for job in jobs
            ]

            return jsonify({'jobs': job_list}), 200
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
    @app.route('/api/delete_job/<string:job_id>', methods=['DELETE'])
    @cross_origin()
    def delete_job(job_id):
        try:
            job = Job.query.filter_by(job_id=job_id).first()

            if job:
                db.session.delete(job)
                db.session.commit()
                return jsonify({'message': 'Job deleted successfully'}), 200
            else:
                return jsonify({'error': 'Job not found'}), 404
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500
    
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
                    db.session.commit()
                    return jsonify({'message': 'Job status updated successfully'}), 200
                else:
                    return jsonify({'error': 'Invalid status provided'}), 400
            else:
                return jsonify({'error': 'Job not found'}), 404
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500

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

            return jsonify({
                'totalJobs': total_jobs,
                'totalRejectedJobs': total_rejected_jobs,
                'totalOAReceived': total_oa,
                'totalTechInterviewReceived': total_tech_interview,
                'totalAcceptedJobs': total_accepted,
                'dailyJobApplications': daily_job_applications_list
            }), 200
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500
        
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
                    'date_applied': job.date_applied.isoformat(),
                    'referral': job.referral,
                    'referrer_name': job.referrer_name,
                    'application_status': job.application_status.value
                }
                return jsonify({'jobDetails': job_details}), 200
            else:
                return jsonify({'error': 'Job not found'}), 404
        except Exception as e:
            return jsonify({'error': f'An error occurred: {str(e)}'}), 500
