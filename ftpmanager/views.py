import os
from urllib.parse import quote, unquote
from django.http import FileResponse, Http404, HttpResponse
from django.shortcuts import render
from django.views.decorators.http import require_POST
from ftpmanager.ftp_utils import *
from django.http import HttpResponse
from ftplib import FTP
from django.shortcuts import render, redirect
from django.views.decorators.csrf import csrf_exempt




host_name = '192.168.1.167'
user_name = 'justin'
password = 'Romeo2020$'

# Consider using Django's built-in login_required decorator to secure this view
@csrf_exempt  # Only for demonstration; consider CSRF protection for production
def upload_to_ftp(request):
    if request.method == 'POST':
        # Get the file from the form
        file_to_upload = request.FILES['file']
        filename = file_to_upload.name

        # FTP Server details
        ftp_host = host_name
        ftp_username = user_name
        ftp_password = password

        # Connect to the FTP server
        with FTP(ftp_host, ftp_username, ftp_password) as ftp:
            ftp.storbinary(f'STOR {filename}', file_to_upload)

        return HttpResponse("File successfully uploaded to FTP server.")

    # If not a POST request, show the form
    return render(request, 'ftpmanager/upload_to_ftp.html')

# Create your views here.

from urllib.parse import quote, unquote

def list_ftp_files(request, path=""):
    # Decode the path to replace %20 with spaces, and other URL-encoded chars appropriately
    decoded_path = unquote(path)

    ftp = ftp_connect('192.168.1.167', username='justin', password='Romeo2020$')
    files, dirs = list_files(ftp, decoded_path)
    ftp.quit()

    # Normalize the current_path to ensure it always starts with a slash but doesn't end with one (unless it's just "/")
    if not decoded_path.startswith('/'):
        decoded_path = '/' + decoded_path
    if decoded_path != "/" and decoded_path.endswith('/'):
        decoded_path = decoded_path[:-1]

    # Split the decoded_path to get breadcrumbs and calculate the parent directory
    path_parts = decoded_path.strip('/').split('/')
    parent_path = '/'.join(path_parts[:-1])  # Exclude the last part for the parent directory
    if parent_path != "":
        parent_path = "/" + parent_path  # Ensure the parent_path is correctly prefixed

    # Ensure the path used in links correctly ends with a slash
    link_path = decoded_path if decoded_path.endswith('/') else decoded_path + '/'

    print("Before encoding:", dirs)
    encoded_dirs = [(quote(dir), dir) for dir in dirs]
    print("After encoding:", encoded_dirs)

    # Accumulate breadcrumb paths
    breadcrumb_paths = []
    accumulated_path = ""
    for part in path_parts:
        accumulated_path += "/" + part  # Build up the path incrementally
        breadcrumb_paths.append((accumulated_path.strip("/"), part))  # Strip leading slash for URL resolution

    return render(request, 'ftpmanager/list_files.html', {
        'files': files,
        'dirs': encoded_dirs,  # Use encoded directory names for links
        'current_path': decoded_path,
        'link_path': link_path,  # Use this for building directory links in the template
        'parent_path': parent_path,
        'path_parts': path_parts,
        'breadcrumb_paths': breadcrumb_paths,
    })


def download_file(request, path):
    ftp = ftp_connect('192.168.1.167', username='justin', password='Romeo2020$')

    # The path should be sanitized/validated to avoid security issues,
    # such as accessing files outside the intended directory.
    
    # Temporary file to store download
    local_filename = os.path.join('/tmp', os.path.basename(path))
    try:
        with open(local_filename, 'wb') as local_file:
            ftp.retrbinary(f'RETR {path}', local_file.write)
        
        # Serve the file
        response = FileResponse(open(local_filename, 'rb'))
        response['Content-Disposition'] = f'attachment; filename="{os.path.basename(path)}"'

        return response
    except Exception as e:
        raise Http404(f"File not found: {e}")
    finally:
        ftp.quit()
        # Cleanup: remove the temporary file after serving it
        os.remove(local_filename)


def upload_file(request, path=''):
    if request.method == 'POST':
        file_to_upload = request.FILES['file_upload']
        decoded_path = unquote(path)  # Decode the path if it's URL-encoded

        try:
            ftp = ftp_connect(host_name, 21, user_name, password)
            ftp.cwd(decoded_path)  # Change to the current directory
            ftp.storbinary(f'STOR {file_to_upload.name}', file_to_upload)

            ftp.quit()
            return redirect('list_ftp_files', path=path)  # Redirect back to the current directory listing
        except Exception as e:
            return HttpResponse(f"Failed to upload file: {str(e)}", status=500)

    # If not a POST request or if any other issue occurs, redirect to home or an error page
    return redirect('list_ftp_files')


from urllib.parse import unquote

@require_POST
def delete_file(request, file_name):
    current_path = request.POST.get('current_path', '')
    decoded_file_name = unquote(file_name)  # Decode file_name to handle spaces
    full_path = os.path.join(current_path, decoded_file_name).replace('\\', '/')  # Construct the full path
    try:
        ftp = ftp_connect(host_name, 21, user_name, password)
        ftp.cwd(current_path)  # Navigate to the current directory
        ftp.delete(decoded_file_name)  # Delete the specified file
        ftp.quit()
    except Exception as e:
        return HttpResponse(f"Failed to delete file: {str(e)}", status=500)
    
    return redirect('list_ftp_files', path=current_path)

@require_POST
def delete_directory(request, dir_name):
    current_path = request.POST.get('current_path', '')
    decoded_dir_name = unquote(dir_name)  # Decode dir_name to handle spaces
    full_path = os.path.join(current_path, decoded_dir_name).replace('\\', '/')  # Construct the full path
    try:
        ftp = ftp_connect(host_name, 21, user_name, password)
        ftp.cwd(current_path)  # Navigate to the current directory
        ftp.rmd(decoded_dir_name)  # Attempt to remove the directory
        ftp.quit()
    except Exception as e:
        return HttpResponse(f"Failed to delete directory: {str(e)}", status=500)
    
    return redirect('list_ftp_files', path=current_path)


@require_POST
def create_directory(request, current_path):
    new_dir_name = request.POST.get('new_dir_name')
    if not new_dir_name:
        return HttpResponse("Directory name is required.", status=400)

    try:
        ftp = ftp_connect(host_name,21, user_name, password)
        # Construct the full path for the new directory
        new_dir_path = f"{current_path}/{new_dir_name}".strip('/')
        ftp.mkd(new_dir_path)
        ftp.quit()
    except Exception as e:
        return HttpResponse(f"Failed to create directory: {str(e)}", status=500)
    
    return redirect('list_ftp_files', path=current_path)