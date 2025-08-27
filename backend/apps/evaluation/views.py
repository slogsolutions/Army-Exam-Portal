from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from .models import Evaluation
from .serializers import EvaluationSerializer

class EvaluationListView(generics.ListCreateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

class EvaluationCreateView(generics.CreateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

class EvaluationDetailView(generics.RetrieveAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

class EvaluationUpdateView(generics.UpdateAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

class EvaluationDeleteView(generics.DestroyAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]

class BatchEvaluationView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, *args, **kwargs):
        # TODO: Implement batch evaluation functionality
        return Response({"message": "Batch evaluation functionality coming soon"}, status=status.HTTP_200_OK)

class EvaluationExportView(generics.ListAPIView):
    queryset = Evaluation.objects.all()
    serializer_class = EvaluationSerializer
    permission_classes = [IsAuthenticated]
    
    def get(self, request, *args, **kwargs):
        # TODO: Implement export functionality
        return Response({"message": "Export functionality coming soon"}, status=status.HTTP_200_OK)
