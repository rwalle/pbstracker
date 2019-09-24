from rest_framework import serializers

from .models import PBSJob


class PBSJobSerializer(serializers.ModelSerializer):

    class Meta:

        model = PBSJob
        fields = ('jobid', 'jobname', 'username', 'status', 'submitted', 'started', 'finished', 'exitcode', 'stderr', 'stdout', 'archived')

class PBSJobSimpleSerializer(serializers.ModelSerializer):

    class Meta:

        model = PBSJob
        fields = ('jobid', 'jobname', 'username', 'status', 'submitted', 'finished', 'archived', 'exitcode')
