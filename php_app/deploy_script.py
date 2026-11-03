import paramiko

host = '217.65.157.66'
port = 65002
user = 'u403342603'
password = 'Mezzomet2#'

files_to_upload = [
    ('index.php', 'index.php'),
    ('includes/navbar.php', 'includes/navbar.php'),
    ('includes/header.php', 'includes/header.php')
]

roots = [
    '/home/u403342603/domains/sentechplus.com/public_html',
    '/home/u403342603/public_html'
]

# 1. SFTP Upload
transport = paramiko.Transport((host, port))
transport.connect(username=user, password=password)
sftp = paramiko.SFTPClient.from_transport(transport)

for local_f, remote_f in files_to_upload:
    for root in roots:
        remote_path = f"{root}/{remote_f}"
        print(f"Uploading {local_f} to {remote_path}")
        sftp.put(local_f, remote_path)

sftp.close()
transport.close()

# 2. SSH Cache Clear
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect(host, port=port, username=user, password=password)

cmd = "rm -rf /home/u403342603/domains/sentechplus.com/public_html/storage/cache/* && rm -rf /home/u403342603/public_html/storage/cache/*"
print("Running command:", cmd)
stdin, stdout, stderr = ssh.exec_command(cmd)
print("Output:", stdout.read().decode())
print("Error:", stderr.read().decode())

ssh.close()
