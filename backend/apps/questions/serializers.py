from rest_framework import serializers
from .models import Question
from apps.authentication.serializers import CenterSerializer, UserSerializer

class QuestionSerializer(serializers.ModelSerializer):
    center = CenterSerializer(read_only=True)
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Question
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')
    
    def validate(self, data):
        # Ensure marks is positive
        if data.get('marks') <= 0:
            raise serializers.ValidationError("Marks must be positive")
        
        # For multiple choice questions, ensure options are provided
        if data.get('question_type') == 'multiple_choice':
            if not any([data.get('option_a'), data.get('option_b'), 
                       data.get('option_c'), data.get('option_d')]):
                raise serializers.ValidationError("Multiple choice questions must have at least 2 options")
        
        return data
