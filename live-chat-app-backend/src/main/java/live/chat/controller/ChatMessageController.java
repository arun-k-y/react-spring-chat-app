package live.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import live.chat.entity.ChatMessage;
import live.chat.entity.ChatNotification;
import live.chat.service.ChatMessageService;

@CrossOrigin(origins = "*")
@Controller
public class ChatMessageController {

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@Autowired
	private ChatMessageService chatMessageService;

	@MessageMapping("/chat")
	public void processMessage(@Payload ChatMessage chatMessage) {
		System.out.println("processing message.................");

		ChatMessage savedMessage = chatMessageService.save(chatMessage);

		String recipientId = chatMessage.getRecipientId();
		String destination = "/queue/messages";
		System.out.println("Sending notification to user " + recipientId + " on destination " + destination);

		messagingTemplate.convertAndSendToUser(recipientId, destination,
				new ChatNotification(savedMessage.getId(), savedMessage.getSenderId(), savedMessage.getRecipientId(),
						savedMessage.getContent(), savedMessage.getTimestamp()));
	}

	@GetMapping("/messages/{senderId}/{recipientId}")
	public ResponseEntity<List<ChatMessage>> getChatMessages(@PathVariable String senderId,
			@PathVariable String recipientId) {
		return ResponseEntity.ok(chatMessageService.findChatMessages(senderId, recipientId));
	}

}
