package live.chat.entity;

import java.util.Date;

public class ChatNotification {

	private Integer id;
	private String senderId;
	private String recipientId;
	private String content;
	private Date timestamp;

	public ChatNotification() {
		// No-argument constructor
	}

	public ChatNotification(Integer id, String senderId, String recipientId, String content, Date timestamp) {
		this.id = id;
		this.senderId = senderId;
		this.recipientId = recipientId;
		this.content = content;
		this.timestamp = timestamp;
	}

	public ChatNotification(String senderId, String recipientId, String content, Date timestamp) {
		this.senderId = senderId;
		this.recipientId = recipientId;
		this.content = content;
		this.timestamp = timestamp;
	}

	public Date getTimestamp() {
		return timestamp;
	}

	public void setTimestamp(Date timestamp) {
		this.timestamp = timestamp;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getSenderId() {
		return senderId;
	}

	public void setSenderId(String senderId) {
		this.senderId = senderId;
	}

	public String getRecipientId() {
		return recipientId;
	}

	public void setRecipientId(String recipientId) {
		this.recipientId = recipientId;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	// Builder
	public static class Builder {
		private Integer id;
		private String senderId;
		private String recipientId;
		private String content;
		private Date timestamp;

		public Builder id(Integer id) {
			this.id = id;
			return this;
		}

		public Builder senderId(String senderId) {
			this.senderId = senderId;
			return this;
		}

		public Builder recipientId(String recipientId) {
			this.recipientId = recipientId;
			return this;
		}

		public Builder content(String content) {
			this.content = content;
			return this;
		}

		public Builder timestamp(Date timestamp) {
			this.timestamp = timestamp;
			return this;
		}

		public ChatNotification build() {
			return new ChatNotification(id, senderId, recipientId, content, timestamp);
		}
	}
}
