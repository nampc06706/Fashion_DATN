import Star from "../Helpers/icons/Star";

export default function Reviews({
  comments
  
}) {
  return (
    <div className="review-wrapper w-full">
      <div className="w-full reviews mb-[60px]">
        <div className="w-full comments mb-[60px]">
          {comments && comments.length > 0 ? (
            comments.map((comment, index) => (
              comment && comment.id ? (  // Kiểm tra nếu comment và comment.id tồn tại
                <div
                  key={comment.id || index}  // Sử dụng index như key dự phòng
                  className="comment-item bg-white px-10 py-[32px] mb-2.5"
                >
                  <div className="comment-author flex justify-between items-center mb-3">
                    <div className="flex space-x-3 items-center">
                      <div className="w-[50px] h-[50px] rounded-full overflow-hidden">
                        <img
                          src={`/assets/images/comment-user-1.png`}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-[18px] font-medium text-qblack">
                          {comment.fullname}
                        </p>
                        <p className="text-[13px] font-normal text-qgray">
                          {comment.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex">
                        {Array.from(Array(Number(comment.stars)), () => (
                          <span key={comment.id + Math.random()}>
                            <Star />
                          </span>
                        ))}
                      </div>
                      <span className="text-[13px] font-normal text-qblack mt-1 inline-block">
                        ({comment.stars}.0)
                      </span>
                    </div>
                  </div>
                  <div className="comment mb-[30px]">
                    <p className="text-[15px] text-qgray leading-7 text-normal">
                      {comment.review}
                    </p>
                  </div>
                </div>
              ) : null  // Bỏ qua comment không có id
            ))
          ) : (
            <p>Chưa có đánh giá nào! hãy mua và đánh giá nó nhé.</p>  // Hiển thị thông báo nếu không có comments
          )}
        </div>
      </div>
    </div>
  );
}
