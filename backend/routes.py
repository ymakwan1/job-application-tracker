# backend/routes.py
from flask import jsonify, request
from models import db, Job, ApplicationStatus
from flask_cors import cross_origin

def init_routes(app):
    @app.route('/api/jobs', methods=['POST'])
    @cross_origin()
    def add_job():
        data = request.get_json()
        print(data)
        new_job = Job(
            job_id=data['jobId'],
            title=data['title'],
            company=data['company'],
            job_type=data['jobType'],
            job_posting_url=data['jobPostingUrl'],
            dashboard_url=data['dashboardUrl'],
            job_posting_source=data['jobPostingSource'],
            date_applied=data['dateApplied'],
            referral=data['referral'],
            referrer_name=data['referrerName'] if data['referral'] else None,
            application_status = ApplicationStatus.APPLIED
        )

        db.session.add(new_job)
        db.session.commit()

        return jsonify({'message': 'Job added successfully'}), 201
    
    @app.route('/api/companies', methods=['GET'])
    @cross_origin()
    def get_companies():
        companies = Job.query.with_entities(Job.company).distinct().all()
        company_names = [company[0] for company in companies]
        return jsonify({'companies': company_names}), 200
    
    @app.route('/api/show_jobs', methods=['GET'])
    @cross_origin()
    def show_jobs():
        # Query all job fields
        jobs = Job.query.all()

        # Convert job objects to a list of dictionaries
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
    
    @app.route('/api/delete_job/<string:job_id>', methods=['DELETE'])
    @cross_origin()
    def delete_job(job_id):
        job = Job.query.filter_by(job_id=job_id).first()

        if job:
            db.session.delete(job)
            db.session.commit()
            return jsonify({'message': 'Job deleted successfully'}), 200
        else:
            return jsonify({'error': 'Job not found'}), 404
        
    
    @app.route('/api/update_status/<string:job_id>', methods=['PUT'])
    @cross_origin()
    def update_status(job_id):
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
