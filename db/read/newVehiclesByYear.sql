select * from vehicles v
join users u on u.id = v.ownerId
where year > 1999
order by year desc;