from django import template
from urllib.parse import quote

register = template.Library()

@register.filter(name='urlquote')
def urlquote(value):
    return quote(value)

@register.filter(name='join_path')
def join_path(current_path, file_name):
    # Ensure the current_path ends with exactly one slash
    if not current_path.endswith('/'):
        current_path += '/'
    # Return the concatenated path
    return f"{current_path}{file_name}"


@register.filter(name='truncate_filename')
def truncate_filename(filename):
    # Check if the filename length is greater than the sum of characters to keep
    if len(filename) > (15 + 4):
        return f"{filename[:15]}...{filename[-4:]}"
    return filename