// Message.tsx
import { Card } from '@mantine/core';

type MessageProps = {
  content: string;
  isUser: boolean;
};

const Message: React.FC<MessageProps> = ({ content, isUser }) => {
  return (
    <Card
      shadow="xs"
      padding="sm"
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        marginBottom: '8px', // Add spacing between messages
      }}
    >
      {content}
    </Card>
  );
};

export default Message;