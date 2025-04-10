-- Procedure to send an email
create or replace function send_email(
  recipient_emails text[],
  subject text,
  body text
)
returns uuid
language plpgsql
security definer
as $$
declare
  sender_id uuid;
  new_email_id uuid;
  recipient_id uuid;
  recipient_email text;
  sender_email text;
  unique_recipient_emails text[];
begin
  -- Get the current user's ID (sender)
  sender_id := auth.uid();
  
  if sender_id is null then
    raise exception 'User not authenticated';
  end if;
  
  -- Remove duplicates from recipient_emails
  unique_recipient_emails := ARRAY(SELECT DISTINCT UNNEST(recipient_emails));

  -- Check if recipient_emails is empty
  if array_length(unique_recipient_emails, 1) is null then
    raise exception 'Recipient emails cannot be empty';
  end if;

  -- Get sender's email
  select email_address into sender_email
  from profiles
  where id = sender_id;

  
  -- Start transaction
  begin
    -- Create the email
    insert into emails (sender_profile_id, subject, body)
    values (sender_id, subject, body)
    returning id into new_email_id;
    
    -- Add recipients
    foreach recipient_email in array unique_recipient_emails
    loop
      -- Find or create recipient profile
      select id into recipient_id
      from profiles
      where email_address = recipient_email;
      
      if recipient_id is null then
        continue;
      end if;
      
      -- Add to email_recipients
      insert into email_recipients (email_id, recipient_profile_id)
      values (new_email_id, recipient_id);
      
      if sender_id = recipient_id then
        continue;
      end if;
      
      -- Add to email_status for the recipient
      insert into email_status (email_id, profile_id, is_read, folder_id)
      values (new_email_id, recipient_id, false, null);
    end loop;
    
    -- Add to email_status for the sender
      insert into email_status (email_id, profile_id, is_read, folder_id)
      values (new_email_id, sender_id, true, null);
    
    -- Commit transaction
    return new_email_id;
  exception
    when others then
      -- Rollback transaction on any error
      raise exception 'Failed to send email: %', SQLERRM;
  end;
end;
$$;

-- Procedure to reply to an email
create or replace function reply_to_email(
  original_email_id uuid,
  subject text,
  body text
)
returns uuid
language plpgsql
security definer
as $$
declare
  sender_id uuid;
  new_email_id uuid;
begin
  -- Get the current user's ID (sender)
  sender_id := auth.uid();
  
  if sender_id is null then
    raise exception 'User not authenticated';
  end if;
  
  -- Start transaction
  begin
    
    -- Create the reply email
    insert into emails (sender_profile_id, subject, body)
    values (sender_id, subject, body)
    returning id into new_email_id;
    
    -- Notify the sender that they have a new email
    update email_status
    set is_read = false
    where email_id = original_email_id
    and profile_id = sender_id
    and deleted_at is null;
    
    -- Create the email_replies relationship
    insert into email_replies (email_id, reply_email_id)
    values (original_email_id, new_email_id);
    
    -- Commit transaction
    return new_email_id;
  exception
    when others then
      -- Rollback transaction on any error
      raise exception 'Failed to reply to email: %', SQLERRM;
  end;
end;
$$;

