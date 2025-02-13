package live.chat.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.chat.entity.ChatRoom;
import live.chat.repository.ChatRoomRepository;

@Service
public class ChatRoomService {

	@Autowired
	private ChatRoomRepository chatRoomRepository;

	public Optional<String> getChatRoomId(String senderId, String recipientId, boolean createNewRoomIfNotExists) {

		var chatRoom = chatRoomRepository.findBySenderIdAndRecipientId(senderId, recipientId);

		return chatRoom.map(ChatRoom::getChatId).or(() -> {
			if (createNewRoomIfNotExists) {
				String chatId = createChatId(senderId, recipientId);
				return Optional.of(chatId);
			}
			return Optional.empty();
		});
	}

	private String createChatId(String senderId, String recipientId) {

		String chatId = String.format("%s_%s", senderId, recipientId);

		ChatRoom senderRecipient = new ChatRoom(chatId, senderId, recipientId);
		ChatRoom recipientSender = new ChatRoom(chatId, recipientId, senderId);

		chatRoomRepository.save(senderRecipient);
		chatRoomRepository.save(recipientSender);

		return chatId;
	}

}