from django.urls import path
from . import views

app_name = 'candidates'

urlpatterns = [
    path('', views.CandidateListView.as_view(), name='candidate-list'),
    path('create/', views.CandidateCreateView.as_view(), name='candidate-create'),
    path('<int:pk>/', views.CandidateDetailView.as_view(), name='candidate-detail'),
    path('<int:pk>/update/', views.CandidateUpdateView.as_view(), name='candidate-update'),
    path('<int:pk>/delete/', views.CandidateDeleteView.as_view(), name='candidate-delete'),
    path('bulk-upload/', views.CandidateBulkUploadView.as_view(), name='candidate-bulk-upload'),
    path('export/', views.CandidateExportView.as_view(), name='candidate-export'),
]
