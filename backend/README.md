# Offline Examination Management System - Django Backend

A comprehensive Django backend for managing offline examinations across multiple centers with MongoDB integration.

## Features

- **Multi-Center Support**: Manage examinations across multiple locations
- **Offline Operation**: Fully functional without internet connectivity
- **JWT Authentication**: Secure API access with token-based authentication
- **File Management**: Handle candidate photos, question documents, and result exports
- **Data Sync**: Management commands for data synchronization between centers
- **MongoDB Integration**: Scalable NoSQL database using djongo
- **RESTful API**: Complete API endpoints for frontend integration

## Project Structure

```
backend/
├── exam_system/          # Main project settings
├── apps/
│   ├── authentication/   # User management & JWT auth
│   ├── candidates/       # Candidate registration & management
│   ├── exams/           # Exam creation & scheduling
│   ├── questions/       # Question bank management
│   ├── results/         # Exam results & scoring
│   └── evaluation/      # Paper evaluation & grading
├── utils/               # Common utilities & helpers
├── management/          # Custom management commands
├── media/              # File uploads
├── static/             # Static files
└── templates/          # HTML templates
```

## Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration
```

4. Run migrations:
```bash
python manage.py migrate
```

5. Create superuser:
```bash
python manage.py createsuperuser
```

6. Run development server:
```bash
python manage.py runserver
```

## Environment Variables

Create a `.env` file with the following variables:

```env
DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_URL=mongodb://localhost:27017/exam_system
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000,http://127.0.0.1:3000
JWT_SECRET_KEY=your-jwt-secret-key
REDIS_URL=redis://localhost:6379
```

## API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/logout/` - User logout

### Candidates
- `GET /api/candidates/` - List candidates
- `POST /api/candidates/` - Create candidate
- `GET /api/candidates/{id}/` - Get candidate details
- `PUT /api/candidates/{id}/` - Update candidate
- `DELETE /api/candidates/{id}/` - Delete candidate

### Exams
- `GET /api/exams/` - List exams
- `POST /api/exams/` - Create exam
- `GET /api/exams/{id}/` - Get exam details
- `PUT /api/exams/{id}/` - Update exam
- `DELETE /api/exams/{id}/` - Delete exam

### Questions
- `GET /api/questions/` - List questions
- `POST /api/questions/` - Create question
- `GET /api/questions/{id}/` - Get question details
- `PUT /api/questions/{id}/` - Update question
- `DELETE /api/questions/{id}/` - Delete question

### Results
- `GET /api/results/` - List results
- `POST /api/results/` - Create result
- `GET /api/results/{id}/` - Get result details
- `PUT /api/results/{id}/` - Update result
- `DELETE /api/results/{id}/` - Delete result

## Management Commands

### Data Sync Operations
```bash
# Export data from current center
python manage.py export_center_data --center-id 1 --output-file center_data.json

# Import data to current center
python manage.py import_center_data --input-file center_data.json

# Sync results between centers
python manage.py sync_results --source-center 1 --target-center 2

# Backup database
python manage.py backup_database --output-file backup.json

# Restore database
python manage.py restore_database --input-file backup.json
```

### Data Management
```bash
# Bulk import candidates
python manage.py bulk_import_candidates --file candidates.xlsx

# Export exam results
python manage.py export_exam_results --exam-id 1 --format excel

# Generate center reports
python manage.py generate_center_report --center-id 1 --date 2024-01-15
```

## Security Features

- JWT token authentication
- Rate limiting on API endpoints
- CORS configuration for frontend
- File upload validation
- SQL injection protection
- XSS protection
- CSRF protection

## Offline Capabilities

- Local MongoDB database
- File-based data export/import
- Offline result processing
- Local user authentication
- Data synchronization when online

## Testing

Run tests with:
```bash
python manage.py test
# or
pytest
```

## Deployment

For production deployment:

1. Set `DEBUG=False` in environment
2. Configure production database
3. Set up static file serving
4. Configure logging
5. Set up monitoring and backup

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.
