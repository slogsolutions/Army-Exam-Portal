from rest_framework import serializers
from .models import Evaluation
from apps.candidates.serializers import CandidateSerializer
from apps.exams.serializers import ExamSerializer
from apps.exam_results.serializers import ResultSerializer
from apps.authentication.serializers import CenterSerializer, UserSerializer

class EvaluationSerializer(serializers.ModelSerializer):
    result = ResultSerializer(read_only=True)
    candidate = CandidateSerializer(read_only=True)
    exam = ExamSerializer(read_only=True)
    evaluator = UserSerializer(read_only=True)
    center = CenterSerializer(read_only=True)
    
    class Meta:
        model = Evaluation
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'percentage')
    
    def validate(self, data):
        # Ensure marks awarded doesn't exceed max marks
        if data.get('marks_awarded') and data.get('max_marks'):
            if data['marks_awarded'] > data['max_marks']:
                raise serializers.ValidationError("Marks awarded cannot exceed max marks")
        
        # Ensure max marks is positive
        if data.get('max_marks') <= 0:
            raise serializers.ValidationError("Max marks must be positive")
        
        return data
