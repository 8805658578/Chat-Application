package com.subsstring.chat.controllers;

import com.subsstring.chat.entities.Message;
import com.subsstring.chat.entities.Room;
import com.subsstring.chat.repositories.RoomRepositories;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin("*")

@RequestMapping("/api/v1/rooms")
public class RoomController {

    private RoomRepositories roomRepositories;

    public RoomController(RoomRepositories roomRepositories) {
        this.roomRepositories = roomRepositories;
    }


    //create room
    @PostMapping
    public ResponseEntity<?> createRoom(@RequestBody String  roomId) {

        if(roomRepositories.findByRoomId(roomId) != null){
            //room is alwerdy there
            return ResponseEntity.badRequest().body("Room already exists!");
        }

        //ceeate room
        Room room = new Room();
        room.setRoomId(roomId);
        Room savedRoom = roomRepositories.save(room);
        return ResponseEntity.status(HttpStatus.CREATED).body(room);
    }



    //get room
    @GetMapping("/{roomId}")
    public ResponseEntity<?> joinRoom(
        @PathVariable String roomId
    ){
        Room room = roomRepositories.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().body("Room does not exists!");
        }
        return ResponseEntity.ok(room);


    }




    //get message of room
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<List<Message>> getMessages(
            @PathVariable String roomId,
            @RequestParam(value = "page", defaultValue = "0",required = false) int page,
            @RequestParam(value = " size", defaultValue = "20", required = false) int size
    ){
        Room room = roomRepositories.findByRoomId(roomId);
        if(room == null){
            return ResponseEntity.badRequest().build();
        }
        //get Message
        // pagenation

        List<Message> messages = room.getMessages();

        int start=Math.max(0,messages.size()-(page+1)*size);
        int end=Math.min(messages.size(), start+size);
        List<Message> pagenatedMessages = messages.subList(start,end);

        return ResponseEntity.ok(messages);
    }
}
