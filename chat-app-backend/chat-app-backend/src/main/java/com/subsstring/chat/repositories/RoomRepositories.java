package com.subsstring.chat.repositories;

import com.subsstring.chat.entities.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepositories extends MongoRepository<Room, String> {

    //get room using room id
    Room  findByRoomId(String roomId);// user room id

}
