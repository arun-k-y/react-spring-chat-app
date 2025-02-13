package live.chat.service;

import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.chat.entity.ChatMessage;
import live.chat.repository.ChatMessageRepository;

@Service
public class ChatMessageService {

	@Autowired
	private ChatMessageRepository chatMessageRepository;

	@Autowired
	private ChatRoomService chatRoomService;

	public ChatMessage save(ChatMessage chatMessage) {

		var chatId = chatRoomService.getChatRoomId(chatMessage.getSenderId(), chatMessage.getRecipientId(), true)
				.orElseThrow(() -> new NoSuchElementException("Chat room not found"));

		chatMessage.setChatId(chatId);
		chatMessageRepository.save(chatMessage);

		return chatMessage;
	}

	public List<ChatMessage> findChatMessages(String senderId, String recipientId) {

		var chatId = chatRoomService.getChatRoomId(senderId, recipientId, false);

		return chatId.map(chatMessageRepository::findAllMessagesByChatId).orElse(new ArrayList<>());

	}
}
