import React, {useState} from "react";
import {supabase} from "../../supabaseClient";

export async function addChat(sender_id, receiver_id) {
  // const [err, setErr] = useState();
  // const [res, setRes] = useState();
  var err;
  var res;
  const {data, error} = await supabase
    .from("chats")
    .select("*")
    .match({sender_id: sender_id, receiver_id: receiver_id});
  if (error) {
    err = error;
  } else if (data.length === 0) {
    // empty array? then fetch the opposite
    // There was no chat with sender_id == sender_id
    const {data, error} = await supabase
      .from("chats")
      .select("*")
      .match({sender_id: receiver_id, receiver_id: sender_id});

    if (data.length === 0) {
      // No chats at between them at all
      // create new chat
      const {data, error} = await supabase
        .from("chats")
        .insert([{sender_id: sender_id, receiver_id: receiver_id}]);

      if (error) {
        err = error;
      } else if (data) {
        // alert("Chat created");
        res = data;
      }
    } else {
      // There was chat with sender_id == receiver_id
      // Delete that row and create a new one
      const {data, error} = await supabase
        .from("chats")
        .delete()
        .match({sender_id: receiver_id, receiver_id: sender_id});

      if (error) {
        err = error;
      } else if (data) {
        // Create new chat
        const {data, error} = await supabase
          .from("chats")
          .insert([{sender_id: sender_id, receiver_id: receiver_id}]);

        if (error) {
          err = error;
        } else if (data) {
          //   alert("Chat created");
          res = data;
        }
      }
    }
  } else {
    // There was chat with sender_id == sender_id
    // Delete that row and create a new one
    const {data, error} = await supabase
      .from("chats")
      .delete()
      .match({sender_id: sender_id, receiver_id: receiver_id});

    if (error) {
      err = error;
    } else if (data) {
      // Create new chat
      const {data, error} = await supabase
        .from("chats")
        .insert([{sender_id: sender_id, receiver_id: receiver_id}]);

      if (error) {
        err = error;
      } else if (data) {
        // alert("Chat created");
        res = data;
      }
    }
  }

  return [res, err];
}

export async function addTextMessage(sender_id, receiver_id, messageText) {
  var err;
  var res;
  var date = new Date();
  var hrs = date.getHours();
  var mins = date.getMinutes();
  // insert into message table
  const {data, error} = await supabase.from("messages").insert([
    {
      sender_id: sender_id,
      receiver_id: receiver_id,
      message_type: "text",
      content: messageText,
      short_time: `${hrs}:${mins}`,
      read: "no",
    },
  ]);

  if (error) {
    err = error;
  } else if (data) {
    res = data;
  }

  return [res, err];
}

export async function addSmileyMessage(sender_id, receiver_id, smiley) {
  var err;
  var res;
  var date = new Date();
  var hrs = date.getHours();
  var mins = date.getMinutes();
  // insert into message table
  const {data, error} = await supabase.from("messages").insert([
    {
      sender_id: sender_id,
      receiver_id: receiver_id,
      message_type: "smiley",
      content: smiley,
      short_time: `${hrs}:${mins}`,
      read: "no",
    },
  ]);

  if (error) {
    err = error;
  } else if (data) {
    res = data;
  }

  return [res, err];
}

export async function getMessages(sender_id, receiver_id) {
  var err;
  var res = [];
  let {data: Messages, error} = await supabase
    .from("messages")
    .select("*")
    .order("id", {ascending: true});

  if (error) {
    err = error;
  } else if (Messages) {
    Messages.map(msg => {
      if (msg.sender_id === sender_id && msg.receiver_id === receiver_id) {
        res.push(msg);
      }
      if (msg.sender_id === receiver_id && msg.receiver_id === sender_id) {
        res.push(msg);
      }
      // res.push(msg);
    });
  }

  return [res, err];
}

export async function getChats(user_id) {
  var res = [];
  var err;
  const {data, error} = await supabase
    .from("chats")
    .select("*")
    .order("id", {ascending: false});

  if (error) {
    err = error;
  } else if (data) {
    data.map(chat => {
      if (chat.sender_id === user_id) {
        res.push(chat);
      } else if (chat.receiver_id === user_id) {
        res.push(chat);
      }
    });

    return [res, err];
  }
}

export async function getNumUnreadMessages(sender_id, receiver_id) {
  var res = 0;
  var err;

  const {data, error} = await supabase
    .from("messages")
    .select("*")
    .match({sender_id: receiver_id, receiver_id: sender_id, read: "no"});
  if (error) {
    err = error;
  } else if (data) {
    data.map(() => {
      res = res + 1;
    });
  }

  return [res, err];
}

export async function markMessageAsRead(message_id) {
  const {data, error} = await supabase
    .from("messages")
    .update({read: "yes"})
    .match({id: message_id});

  return [data, error];
}

export async function getLatestMessage(sender_id, receiver_id) {
  var messages = [];
  const {data, error} = await supabase
    .from("messages")
    .select("*")
    .order("id", {ascending: false});

  data.map(message => {
    if (
      message.sender_id === sender_id &&
      message.receiver_id === receiver_id
    ) {
      messages.push(message);
    } else if (
      message.sender_id === receiver_id &&
      message.receiver_id === sender_id
    ) {
      messages.push(message);
    }
  });
  return [messages[0], error];
}
