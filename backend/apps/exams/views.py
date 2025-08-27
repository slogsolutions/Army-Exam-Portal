from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Exam
from .serializers import ExamSerializer

class ExamListView(generics.ListCreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

class ExamCreateView(generics.CreateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

class ExamDetailView(generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

class ExamUpdateView(generics.UpdateAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

class ExamDeleteView(generics.DestroyAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]

class ExamConductView(generics.RetrieveAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # TODO: Implement exam conduct functionality
        return Response({"message": "Exam conduct functionality coming soon"}, status=status.HTTP_200_OK)

class ExamExportView(generics.ListAPIView):
    queryset = Exam.objects.all()
    serializer_class = ExamSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # TODO: Implement export functionality
        return Response({"message": "Export functionality coming soon"}, status=status.HTTP_200_OK)
