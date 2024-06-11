import json
from django.db import models

class ChessMoves(models.Model):
    Mode=models.CharField(max_length=10)
    move = models.JSONField()
    Termination_Type=models.CharField(max_length=40)
    def __str__(self):
        return self.move

