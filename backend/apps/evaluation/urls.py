from django.urls import path
from . import views

app_name = 'evaluation'

urlpatterns = [
    path('', views.EvaluationListView.as_view(), name='evaluation-list'),
    path('create/', views.EvaluationCreateView.as_view(), name='evaluation-create'),
    path('<int:pk>/', views.EvaluationDetailView.as_view(), name='evaluation-detail'),
    path('<int:pk>/update/', views.EvaluationUpdateView.as_view(), name='evaluation-update'),
    path('<int:pk>/delete/', views.EvaluationDeleteView.as_view(), name='evaluation-delete'),
    path('batch/', views.BatchEvaluationView.as_view(), name='batch-evaluation'),
    path('export/', views.EvaluationExportView.as_view(), name='evaluation-export'),
]
