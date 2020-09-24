-- SQLite
select class_schedule.* from users join classes on users.id = classes.user_id join class_schedule on classes.id = class_schedule.class_id where users.id=1 order by users.id;