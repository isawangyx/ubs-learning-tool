from django.shortcuts import render
from django.contrib.auth.models import User

# Create your views here.
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import UserSerializer

class UserCreateView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]
