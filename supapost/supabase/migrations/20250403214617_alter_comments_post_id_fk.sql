alter table comments drop constraint comments_post_id_fk;

alter table comments add constraint comments_post_id_fk 
    foreign key (post_id) references posts(id) on delete cascade;