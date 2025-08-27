from rest_framework import serializers
from .models import Exam
from apps.authentication.serializers import CenterSerializer, UserSerializer

class ExamSerializer(serializers.ModelSerializer):
    center = CenterSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Exam
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def validate(self, data):
        # Ensure end_date is after start_date
        if data.get('end_date') <= data.get('start_date'):
            raise serializers.ValidationError("End date must be after start date")
        
        # Ensure duration is positive
        if data.get('duration_minutes') <= 0:
            raise serializers.ValidationError("Duration must be positive")
        
        return data
