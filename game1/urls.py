from django.urls import path
from game1.views import home,getdata,home_nope
urlpatterns = [
	path('',home),
	path('a',home_nope),
	path('moves_data',getdata)
]