from ftplib import FTP

def ftp_connect(host, port=21, username='', password=''):
    ftp = FTP()
    ftp.connect(host, int(port))
    ftp.login(username, password)
    return ftp

import ftplib

def list_files(ftp, path=""):
    files = []
    dirs = []
    def parse_line(line):
        parts = line.split(maxsplit=8)  # Splitting by space, max 9 parts
        name = parts[-1]  # The last part is the name
        if line.startswith('d'):
            dirs.append(name)
        else:
            files.append(name)

    ftp.cwd(path)  # Change to the desired directory
    ftp.retrlines('LIST', parse_line)
    return files, dirs
