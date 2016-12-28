select * from users u
join vehicles v on u.id = v.ownerId
where u.firstname like $1;