from rest_framework import serializers

class ProgressUpdateSerializer(serializers.Serializer):
    module_id          = serializers.IntegerField()
    event_type         = serializers.ChoiceField(choices=['view','chapter', 'complete'])
    grade              = serializers.IntegerField(min_value=0, max_value=100, required=False)
    certified          = serializers.BooleanField(required=False)

class ProgressHistorySerializer(serializers.Serializer):
    date       = serializers.DateField()
    ndays_act  = serializers.IntegerField()
    nchapters  = serializers.IntegerField()
