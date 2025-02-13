package live.chat.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import live.chat.entity.Status;
import live.chat.entity.User;
import live.chat.repository.UserRepository;

@Service
public class UserService {

	@Autowired
	private UserRepository userRepository;
	// private private UserRepository userRepository;

	// @Autowired
	// public UserService(UserRepository userRepository) {
	// this.userRepository = userRepository;
	// }

	// when user connects - save that user
	// public void saveUser(User user) {
		// System.out.println("Saving user: " + user.getNickName());

		// user.setStatus(Status.ONLINE);

		// userRepository.save(user);

	// }

	public User saveUser(User user) {
		System.out.println("Saving user: " + user.getNickName());
	
		user.setStatus(Status.ONLINE);
	
		// Assign a random avatar if not provided
		if (user.getAvatarUrl() == null || user.getAvatarUrl().isEmpty()) {
			user.setAvatarUrl("https://api.dicebear.com/8.x/avataaars/png?seed=" + user.getNickName());
		}
	
		User savedUser = userRepository.save(user); // Capture returned entity
		// System.out.println("Saved User: " + savedUser.getAvatarUrl()); // Print the saved user
		return savedUser;
	}
	

	public void disconnectUser(User user) {

		User storedUser = userRepository.findById(user.getNickName()).orElse(null);
		// User storedUser =
		// userRepository.findByNickName(user.getNickName()).orElse(null);
		if (storedUser != null) {

			storedUser.setStatus(Status.OFFLINE);

			userRepository.save(storedUser);
		}
	}

	public List<User> findConnectedUsers() {

		return userRepository.findAllByStatus(Status.ONLINE);
	}
}
