# Instructions for django backend

This assumes that you have already properly set up [Django REST framework](https://www.django-rest-framework.org/) and [Django Oauth Toolkit](https://django-oauth-toolkit.readthedocs.io/en/latest/). If not, you will need to create your own `views.py` and `urls.py` and provide your own authentication method.

1. copy `pbstracker` folder to your project folder as an app
2. copy `index.html` of built files of the frontend to `template/pbstracker/` directory under the project, and copy the rest of static files to `static/pbstracker/` (or wherever you put your template and static files)
3. modify `index.html`, add `{% load static %}` at the beginning of the file, and replace `<link rel="manifest" href="manifest.json" />` to  `<link rel="manifest" href="{% static "manifest.json" %}"/>`. Similar for other static files.
4. add `pbstracker` to `INSTALLED_APPS` in your project `settings.py` file, and add `pbstracker`
5. add the following line to `OAUTH2_PROVIDER`, `SCOPES` in `settings.py`:
```
'pbstracker': 'Use PBS job status tracker',
```
(or whatever scope you would like)
6. migrate: run `python manage.py makemigrations` and `python manage.py migrate`
7. You should be good to go!