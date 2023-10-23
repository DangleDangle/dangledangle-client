'use client';
import { ShelterInfo } from '@/api/mypage/bookmark/bookmark';
import useBookmarkList from '@/api/mypage/bookmark/useBookmarkList';
import { Body1 } from '@/components/common/Typography';
import BookmarkCard from '@/components/mypage/BookmarkCard/BookmarkCard';
import useHeader from '@/hooks/useHeader';
import { palette } from '@/styles/color';
import uuidv4 from '@/utils/uuidv4';
import * as styles from './styles.css';

export default function Bookmark() {
  useHeader({ color: palette.white, title: '즐겨찾기 설정' });
  const { data: bookmarks } = useBookmarkList();

  return (
    <main className={styles.contianer}>
      {bookmarks?.shelters?.length !== 0 ? (
        bookmarks?.shelters?.map((bookmark: ShelterInfo) => (
          <BookmarkCard key={uuidv4()} bookmark={bookmark} />
        ))
      ) : (
        <Body1 className={styles.text}>즐겨찾기 한 보호소가 없습니다 🐶</Body1>
      )}
    </main>
  );
}
