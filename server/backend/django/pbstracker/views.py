from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from django.utils import timezone

from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from oauth2_provider.contrib.rest_framework import IsAuthenticatedOrTokenHasScope
from oauth2_provider.views.generic import ScopedProtectedResourceView

from .models import PBSJob
from .serializers import PBSJobSerializer, PBSJobSimpleSerializer


# Create your views here.

@login_required
def index(request, jobid=None):
    response = render(request, 'pbstracker/index.html')
    return response


class PBSJobViewSet(viewsets.ModelViewSet, ScopedProtectedResourceView):

    lookup_value_regex = '[^/]+'
    queryset = PBSJob.objects.all()
    serializer_class = PBSJobSerializer
    permission_classes = (IsAuthenticatedOrTokenHasScope, )
    required_scopes = ['pbstracker']
    lookup_field = 'jobid'

    def list(self, request):

        queryset = PBSJob.objects.all()

        url_query = request.query_params

        if url_query.get('show_archived', None):
            queryset = queryset.filter(archived=True)

        if url_query.get('username', None):
            queryset = queryset.filter(username__icontains = url_query['username'])

        if url_query.get('jobname', None):
            queryset = queryset.filter(jobname__icontains = url_query['jobname'])

        serialized_data = PBSJobSimpleSerializer(queryset, many=True)

        return Response(serialized_data.data)

    @action(detail=True, methods=['post'])
    def started(self, request, pk=None):
        job = self.get_object()
        job.started = timezone.now()
        job.status = 2
        job.save()
        return Response({'success': True})

    @action(detail=True, methods=['post'])
    def exited(self, request, pk=None):

        if not 'exitcode' in data or (int(data['exitcode']) < -12) or (int(data['exitcode']) > 0):
            return Response({'success': False, 'error': "Invalid inputs"}, status = 400)

        job = self.get_object()
        job.finished = timezone.now()
        job.status = 3
        job.exitcode = int(data['exitcode'])
        job.save()
        return Response({'success': True})

    @action(detail=True, methods=['post'])
    def archive(self, request, pk=None):
        job = self.get_object()
        job.archived = True
        job.save()
        return Response({'success': True})

    @action(detail=True, methods=['post'])
    def unarchive(self, request, pk=None):
        job = self.get_object()
        job.archived = False
        job.save()
        return Response({'success': True})

    @action(detail=True, methods=['post'])
    def finished(self, request, pk=None):
        data = request.data
        if not ('stdout' in data and 'stderr' in data):
            return Response({'success': False, 'error': "Invalid inputs"}, status = 400)

        job = self.get_object()
        job.stdout = data['stdout']
        job.stderr = data['stderr']
        job.status = 4 if data['stderr'] == '' else 5
        job.save()
        return Response({'success': True})

