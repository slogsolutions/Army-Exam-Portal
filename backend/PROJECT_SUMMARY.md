# Django Backend - Offline Examination Management System

## Project Overview

This Django backend provides a comprehensive API for managing offline examinations across multiple centers. It's designed to work seamlessly with the React frontend and includes robust security features, MongoDB integration, and offline capabilities.

## 🏗️ Project Structure

```
backend/
├── exam_system/              # Main Django project
│   ├── __init__.py
│   ├── settings.py          # Project configuration
│   ├── urls.py              # Main URL routing
│   ├── wsgi.py              # WSGI configuration
│   ├── asgi.py              # ASGI configuration
│   └── manage.py            # Django management script
├── apps/                     # Django applications
│   ├── authentication/       # User management & JWT auth
│   ├── candidates/           # Candidate registration & management
│   ├── exams/               # Exam creation & scheduling
│   ├── questions/           # Question bank management
│   ├── results/             # Exam results & scoring
│   └── evaluation/          # Paper evaluation & grading
├── utils/                    # Common utilities & helpers
├── management/               # Custom management commands
├── media/                    # File uploads
├── static/                   # Static files
├── templates/                # HTML templates
├── requirements.txt          # Python dependencies
├── env.example               # Environment variables template
└── README.md                 # Project documentation
```

## 🚀 Key Features

### 1. **Authentication & Security**
- **JWT Authentication**: Secure token-based authentication
- **Custom User Model**: Extended user model with roles and permissions
- **Role-Based Access Control**: Admin, Evaluator, Candidate, Center Admin roles
- **Brute Force Protection**: Django Axes integration
- **Session Management**: Track user sessions and login attempts
- **CORS Configuration**: Secure cross-origin requests

### 2. **Multi-Center Support**
- **Center Management**: Create and manage examination centers
- **Center Isolation**: Data isolation between centers
- **Center Admin Roles**: Delegated administration per center

### 3. **Candidate Management**
- **Comprehensive Profiles**: Detailed candidate information
- **Document Management**: Photo and document uploads
- **Bulk Operations**: Import/export candidate data
- **Eligibility Tracking**: Monitor candidate eligibility

### 4. **Offline Capabilities**
- **Local MongoDB**: Fully functional without internet
- **Data Export/Import**: File-based data synchronization
- **Offline Processing**: Local result processing
- **Sync Management**: Background synchronization when online

### 5. **File Management**
- **Secure Uploads**: Validated file uploads with size limits
- **Image Processing**: Candidate photo management
- **Document Storage**: Multiple document types support
- **File Validation**: Type and size validation

## 🗄️ Database Models

### Authentication App
- **User**: Extended user model with roles and center association
- **Center**: Examination center information
- **UserSession**: Session tracking for security
- **LoginAttempt**: Login attempt monitoring

### Candidates App
- **Candidate**: Comprehensive candidate profile
- **CandidatePhoto**: Candidate photograph storage
- **CandidateDocument**: Document management
- **CandidateBulkUpload**: Bulk upload tracking

### Planned Models (To be implemented)
- **Exam**: Examination scheduling and configuration
- **Question**: Question bank management
- **Result**: Exam results and scoring
- **Evaluation**: Paper evaluation and grading

## 🔐 Security Features

### Authentication & Authorization
- JWT token-based authentication
- Role-based access control
- Custom permission classes
- Session management and monitoring

### Data Protection
- SQL injection protection
- XSS protection
- CSRF protection
- File upload validation

### Monitoring & Logging
- Login attempt tracking
- Session monitoring
- Comprehensive logging
- Security event tracking

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login/` - User login
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/logout/` - User logout
- `POST /api/auth/register/` - User registration

### User Management
- `GET /api/auth/users/` - List users (admin only)
- `GET /api/auth/users/{id}/` - User details
- `PUT /api/auth/users/{id}/` - Update user
- `DELETE /api/auth/users/{id}/` - Delete user

### Center Management
- `GET /api/auth/centers/` - List centers
- `POST /api/auth/centers/` - Create center
- `GET /api/auth/centers/{id}/` - Center details
- `PUT /api/auth/centers/{id}/` - Update center

### Security & Monitoring
- `GET /api/auth/sessions/` - User sessions
- `GET /api/auth/login-attempts/` - Login attempts
- `GET /api/auth/system-status/` - System status
- `POST /api/auth/force-logout/` - Force logout

## 🛠️ Technology Stack

### Core Framework
- **Django 4.2.7**: Web framework
- **Django REST Framework**: API framework
- **Django CORS Headers**: Cross-origin support

### Database
- **MongoDB**: NoSQL database
- **djongo**: MongoDB connector for Django
- **pymongo**: MongoDB Python driver

### Authentication
- **JWT**: JSON Web Tokens
- **Django Axes**: Brute force protection
- **Custom Permissions**: Role-based access control

### File Handling
- **Pillow**: Image processing
- **python-magic**: File type detection
- **openpyxl**: Excel file handling

### Data Processing
- **pandas**: Data manipulation
- **numpy**: Numerical computing

### Background Tasks
- **Celery**: Task queue
- **Redis**: Message broker and cache

## 📋 Installation & Setup

### Prerequisites
- Python 3.8+
- MongoDB 4.4+
- Redis 6.0+
- Virtual environment

### Setup Steps
1. **Clone Repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Create Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Environment Configuration**
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

5. **Database Setup**
   ```bash
   # Start MongoDB
   mongod
   
   # Run migrations
   python manage.py migrate
   ```

6. **Create Superuser**
   ```bash
   python manage.py createsuperuser
   ```

7. **Run Development Server**
   ```bash
   python manage.py runserver
   ```

## 🔧 Configuration

### Environment Variables
- **Database**: MongoDB connection settings
- **Security**: JWT secrets and security flags
- **CORS**: Allowed origins for frontend
- **Offline Mode**: System operation mode
- **Center Settings**: Center-specific configuration

### Django Settings
- **Security Middleware**: XSS, CSRF, HSTS protection
- **File Upload Limits**: Size and type restrictions
- **Logging**: Comprehensive logging configuration
- **API Settings**: Pagination, throttling, documentation

## 📊 Management Commands

### Data Management
- `export_center_data`: Export center data to file
- `import_center_data`: Import center data from file
- `sync_results`: Synchronize results between centers
- `backup_database`: Create database backup
- `restore_database`: Restore database from backup

### Candidate Operations
- `bulk_import_candidates`: Import candidates from Excel/CSV
- `export_candidates`: Export candidate data
- `validate_candidates`: Validate candidate data integrity

### System Operations
- `generate_reports`: Generate center and system reports
- `cleanup_sessions`: Clean up expired sessions
- `sync_offline_data`: Synchronize offline data

## 🧪 Testing

### Test Configuration
- **pytest**: Testing framework
- **pytest-django**: Django integration
- **factory-boy**: Test data generation

### Running Tests
```bash
# Run all tests
python manage.py test

# Run with pytest
pytest

# Run specific app tests
pytest apps/authentication/
```

## 🚀 Deployment

### Production Considerations
1. **Environment Variables**: Secure configuration
2. **Database**: Production MongoDB setup
3. **Static Files**: CDN or web server serving
4. **Media Files**: Secure file storage
5. **Monitoring**: Logging and health checks
6. **Backup**: Regular database backups
7. **SSL**: HTTPS configuration

### Docker Support
- Dockerfile for containerization
- docker-compose for local development
- Environment-specific configurations

## 📈 Performance & Scalability

### Database Optimization
- MongoDB indexing strategies
- Query optimization
- Connection pooling

### Caching Strategy
- Redis caching for frequently accessed data
- Query result caching
- Session storage

### API Optimization
- Pagination for large datasets
- Filtering and search capabilities
- Rate limiting and throttling

## 🔄 Data Synchronization

### Offline-First Architecture
- Local data storage and processing
- Background synchronization
- Conflict resolution strategies
- Data integrity validation

### Sync Operations
- **Export**: Center data export to files
- **Import**: Data import from files
- **Merge**: Conflict resolution and data merging
- **Validation**: Data integrity checks

## 🛡️ Security Best Practices

### Authentication
- Secure JWT implementation
- Token refresh mechanisms
- Session invalidation
- Multi-factor authentication support

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CSRF protection

### Access Control
- Role-based permissions
- Object-level security
- Center isolation
- Audit logging

## 📚 API Documentation

### OpenAPI/Swagger
- **drf-spectacular**: API documentation generation
- **Interactive Documentation**: Swagger UI integration
- **Schema Validation**: Request/response validation
- **Example Data**: Sample request/response data

### Documentation Features
- Comprehensive endpoint descriptions
- Request/response examples
- Authentication requirements
- Error code documentation

## 🔍 Monitoring & Logging

### Application Logging
- Structured logging configuration
- Log level management
- File and console output
- Log rotation

### Security Monitoring
- Login attempt tracking
- Session monitoring
- Access pattern analysis
- Security event alerts

### Performance Monitoring
- Response time tracking
- Database query monitoring
- Resource usage tracking
- Error rate monitoring

## 🚧 Future Enhancements

### Planned Features
- **Real-time Updates**: WebSocket integration
- **Advanced Analytics**: Data analysis and reporting
- **Mobile API**: Mobile application support
- **Multi-language**: Internationalization support
- **Advanced Security**: Biometric authentication
- **Cloud Integration**: Cloud storage and services

### Scalability Improvements
- **Microservices**: Service decomposition
- **Load Balancing**: Horizontal scaling
- **Database Sharding**: Data distribution
- **Caching Layers**: Multi-level caching

## 🤝 Contributing

### Development Guidelines
1. **Code Style**: PEP 8 compliance
2. **Documentation**: Comprehensive docstrings
3. **Testing**: Unit and integration tests
4. **Security**: Security-first development
5. **Performance**: Performance considerations

### Contribution Process
1. Fork the repository
2. Create feature branch
3. Implement changes
4. Add tests
5. Submit pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

### Documentation
- Comprehensive README files
- API documentation
- Code comments and docstrings
- Development guides

### Community
- Issue tracking and reporting
- Feature requests
- Bug reports
- Community discussions

---

**Note**: This is a comprehensive Django backend for the Offline Examination Management System. The system is designed to be secure, scalable, and fully functional in offline environments while providing robust APIs for frontend integration.
