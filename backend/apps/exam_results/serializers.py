from rest_framework import serializers
from .models import Result
from apps.candidates.serializers import CandidateSerializer
from apps.exams.serializers import ExamSerializer
from apps.authentication.serializers import CenterSerializer

class ResultSerializer(serializers.ModelSerializer):
    candidate = CandidateSerializer(read_only=True)
    exam = ExamSerializer(read_only=True)
    center = CenterSerializer(read_only=True)
    
    class Meta:
        model = Result
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at', 'percentage')
    
    def validate(self, data):
        # Ensure marks obtained doesn't exceed total marks
        if data.get('marks_obtained') and data.get('total_marks'):
            if data['marks_obtained'] > data['total_marks']:
                raise serializers.ValidationError("Marks obtained cannot exceed total marks")
        
        # Ensure attempt number is positive
        if data.get('attempt_number') <= 0:
            raise serializers.ValidationError("Attempt number must be positive")
        
        return data
