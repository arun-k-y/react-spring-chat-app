package live.chat.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import live.chat.entity.User;
import live.chat.service.UserService;
import lombok.RequiredArgsConstructor;

@CrossOrigin(origins = "*")
@Controller
@RequiredArgsConstructor
public class UserController {

	@Autowired
	private UserService userService;

	public UserController(UserService userService) {
		super();
		this.userService = userService;
	}

	@Autowired
	private SimpMessagingTemplate messagingTemplate;

	@MessageMapping("/user.addUser")
	public void addUser(@Payload User user, SimpMessageHeaderAccessor headerAccessor) {

		userService.saveUser(user);

		String userId = user.getNickName();
		String destination = "/user/" + userId + "/topic";

		System.out.println("Sending message to destination: " + destination);
		System.out.println("Message content: " + user.toString());
		messagingTemplate.convertAndSend(destination, user);

		System.out.println("adding usrrrrrrrrrrrrrr");

	}

	@MessageMapping("/user.disconnectUser")
	@SendTo("/user/public")
	public User disconnect(@Payload User user) {
		userService.disconnectUser(user);
		return user;
	}

	@GetMapping("/users")
	public ResponseEntity<List<User>> findConnectedUsers() {
		System.out.println("fetching users");
		return ResponseEntity.ok(userService.findConnectedUsers());

	}
}
