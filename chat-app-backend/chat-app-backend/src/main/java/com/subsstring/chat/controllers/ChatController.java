package com.subsstring.chat.controllers;

import com.subsstring.chat.entities.Message;
import com.subsstring.chat.entities.Room;
import com.subsstring.chat.playload.MessageRequest;
import com.subsstring.chat.repositories.RoomRepositories;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDateTime;

@RestController
@Controller
@CrossOrigin("http://localost:5173")

public class ChatController {



    private RoomRepositories roomRepositories;

    public ChatController(RoomRepositories roomRepositories) {
        this.roomRepositories = roomRepositories;
    }

    //for sending Messages
    @MessageMapping("/sendMessage/{roomId}")
    @SendTo("/topic/room/{roomId}")
    public Message sendMessage(
            @DestinationVariable String roomId,
            @RequestBody MessageRequest request

    ) throws Exception {

        Room room = roomRepositories.findByRoomId(request.getRoomId());

        Message message = new Message();
        message.setContent(request.getContent());
        message.setSender(request.getSender());
        message.setTimeStamp(LocalDateTime.now());


        if(room != null){
            room.getMessages().add(message);
            roomRepositories.save(room);
        }else{
            throw new RuntimeException("room not found");

        }
        return message;
    }
}