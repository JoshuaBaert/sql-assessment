select * from users u
join vehicles v on u.id = v.ownerId
where u.email = $1
