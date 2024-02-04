from flask_sqlalchemy import SQLAlchemy
from enum import Enum
db = SQLAlchemy()

class ApplicationStatus(Enum):
    APPLIED = 'Applied'
    OA_RECEIVED = 'OA Received'
    TECH_INTERVIEW = 'Tech Interview'
    REJECTED = 'Rejected'
    ACCEPTED = 'Accepted'

class Job(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    job_id = db.Column(db.String(255), nullable=False)
    title = db.Column(db.String(255), nullable=False)
    company = db.Column(db.String(255), nullable=False)
    job_type = db.Column(db.String(50), nullable=False)
    job_posting_url = db.Column(db.String(255), nullable=False)
    dashboard_url = db.Column(db.String(255), nullable=False)
    job_posting_source = db.Column(db.String(50), nullable=False)
    date_applied = db.Column(db.Date, nullable=False)
    date_oa_received = db.Column(db.Date)
    date_tech_interview = db.Column(db.Date)
    date_rejected = db.Column(db.Date)
    date_accepted = db.Column(db.Date)
    referral = db.Column(db.Boolean, default=False)
    referrer_name = db.Column(db.String(255))
    application_status = db.Column(db.Enum(ApplicationStatus), default=ApplicationStatus.APPLIED)
