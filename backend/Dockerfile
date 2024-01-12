FROM python:3.11
WORKDIR /app
COPY . .
RUN pip install --upgrade pip && pip install -r requirements.txt
CMD ["gunicorn", "--workers", "1", "--bind", "0.0.0.0:5000", "app:app"]