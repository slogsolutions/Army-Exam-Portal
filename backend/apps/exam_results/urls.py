from django.urls import path
from . import views

app_name = 'exam_results'

urlpatterns = [
    path('', views.ResultListView.as_view(), name='result-list'),
    path('create/', views.ResultCreateView.as_view(), name='result-create'),
    path('<int:pk>/', views.ResultDetailView.as_view(), name='result-detail'),
    path('<int:pk>/update/', views.ResultUpdateView.as_view(), name='result-update'),
    path('<int:pk>/delete/', views.ResultDeleteView.as_view(), name='result-delete'),
    path('export/', views.ResultExportView.as_view(), name='result-export'),
    path('reports/', views.ResultReportView.as_view(), name='result-reports'),
]
