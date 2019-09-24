from django.db import models

# Create your models here.
class PBSJob(models.Model):
    jobid = models.CharField(max_length=100, db_index=True, unique=True)
    jobname = models.CharField(max_length=50, db_index=True)
    username = models.CharField(max_length=20, db_index=True)
    STATUS_OPTIONS = (
            (1, 'submitted'),
            (2, 'started'),
            (3, 'exited'), # pending stdout/stdout checking
            (4, 'finished'),
            (5, 'finished with error')
            )
    status = models.IntegerField(choices=STATUS_OPTIONS, default=1)
    submitted = models.DateTimeField(auto_now_add=True)
    started = models.DateTimeField(null=True)
    finished = models.DateTimeField(null=True)
    exitcode = models.IntegerField(null=True)
    stderr = models.TextField(blank=True)
    stdout = models.TextField(blank=True)
    archived = models.BooleanField(default=False)

    def __str__(self):
        return self.jobid
