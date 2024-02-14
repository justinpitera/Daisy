from django import template
from urllib.parse import quote

register = template.Library()

@register.filter(name='urlquote')
def urlquote(value):
    return quote(value)