// 서버프로젝트 루트 경로
export const PROJECT_ROOT_PATH = process.cwd();
// 외부에서 접근 가능한 파일을 모아둔 폴더 이름
export const PUBLIC_FOLDER_NAME = 'public';
// 업로드 파일을 저장할 폴더 이름
export const POSTS_FOLDER_NAME = 'posts';
export const TEMP_FOLDER_NAME = 'temp';

export const PUBLIC_FOLDER_PATH = `${PROJECT_ROOT_PATH}/${PUBLIC_FOLDER_NAME}`;
export const POST_IMAGE_PATH = `${PUBLIC_FOLDER_PATH}/${POSTS_FOLDER_NAME}`;
export const TEMP_IMAGE_PATH = `${PUBLIC_FOLDER_PATH}/${TEMP_FOLDER_NAME}`;

// 채팅관련 데이터 저장소 redis로 연결해야함.
export const onlineMap = new Map<
  string,
  {
    userId: number;
    postUserId: number;
    postId: number;
    message: {
      senderId: number;
      content: string;
      createdAt: string;
    }[];
  }
>();
