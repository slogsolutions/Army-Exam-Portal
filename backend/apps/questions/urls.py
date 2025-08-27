from django.urls import path
from . import views

app_name = 'questions'

urlpatterns = [
    path('', views.QuestionListView.as_view(), name='question-list'),
    path('create/', views.QuestionCreateView.as_view(), name='question-create'),
    path('<int:pk>/', views.QuestionDetailView.as_view(), name='question-detail'),
    path('<int:pk>/update/', views.QuestionUpdateView.as_view(), name='question-update'),
    path('<int:pk>/delete/', views.QuestionDeleteView.as_view(), name='question-delete'),
    path('bank/', views.QuestionBankView.as_view(), name='question-bank'),
    path('import/', views.QuestionImportView.as_view(), name='question-import'),
    path('export/', views.QuestionExportView.as_view(), name='question-export'),
]
