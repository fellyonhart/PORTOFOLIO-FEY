my_name  = b"Feyy"
my_email = b"valojol42@gmail.com"

old_emails = {
    b"98526144+MuhammadRadifa@users.noreply.github.com",
    b"m.difa123456@gmail.com",
}

if commit.author_email in old_emails:
    commit.author_name  = my_name
    commit.author_email = my_email

if commit.committer_email in old_emails:
    commit.committer_name  = my_name
    commit.committer_email = my_email