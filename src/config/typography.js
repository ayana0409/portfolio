/**
 * Typography & Text Styling Configuration (Hệ thống cấu hình màu sắc & kích thước chữ)
 * 
 * Centralized design tokens for all text elements across every section of the portfolio.
 * Modify this file to customize font sizes, text colors, and font styles across pages
 * without needing to navigate through JSX component files.
 * 
 * HƯỚNG DẪN TÙY CHỈNH:
 * - Để đổi kích thước chữ: Sửa thuộc tính `size` (vd: 'text-sm', 'text-xl', 'text-4xl', 'sm:text-5xl'...)
 * - Để đổi màu sắc chữ: Sửa thuộc tính `color` (vd: 'text-white', 'text-zinc-400', 'text-amber-400', 'text-[#38bdf8]'...)
 * - Để đổi kiểu chữ / độ đậm: Sửa thuộc tính `style` (vd: 'font-mono', 'font-black', 'uppercase', 'tracking-widest'...)
 */

export const typographyConfig = {
  /* =========================================================================
     00. HERO SECTION (Trang chủ / Màn hình đầu)
     ========================================================================= */
  hero: {
    // Chức danh / Vai trò (Role badge phía trên tên, vd: "LẬP TRÌNH VIÊN")
    role: {
      size: 'text-[11px] sm:text-xs md:text-sm',
      color: 'text-zinc-400',
      style: 'font-mono tracking-[0.25em] sm:tracking-[0.35em] uppercase font-semibold',
    },

    // Tên chính (Hero Candidate Name, vd: "DƯƠNG ĐOÀN THUẬN")
    name: {
      size: 'text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-[0.06em] sm:tracking-[0.1em] leading-tight break-words max-w-full',
    },

    // Slogan / Định hướng phát triển (Mission statement / Slogan phía dưới tên)
    slogan: {
      size: 'text-xs sm:text-sm md:text-base',
      color: 'text-zinc-300',
      style: 'font-light tracking-[0.12em] sm:tracking-[0.2em] max-w-2xl lg:max-w-3xl xl:max-w-4xl uppercase leading-relaxed pb-1 sm:pb-2',
    },

    // Nút hành động chính (Primary button: "KHÁM PHÁ DỰ ÁN")
    primaryButton: {
      size: 'text-xs sm:text-sm',
      color: 'text-black',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Nút hành động phụ (Secondary button: "TẢI CV & BẢNG ĐIỂM")
    secondaryButton: {
      size: 'text-xs sm:text-sm',
      color: 'text-white',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Nhãn mũi tên cuộn trang (Scroll indicator hint)
    scrollIndicator: {
      size: 'text-[9px] sm:text-[10px]',
      color: 'text-zinc-400',
      style: 'font-mono tracking-[0.3em] uppercase',
    },
  },

  /* =========================================================================
     01. ABOUT ME (Trang Giới thiệu bản thân)
     ========================================================================= */
  about: {
    // Huy hiệu section (Pill badge, vd: "01 / ABOUT ME")
    sectionBadge: {
      size: 'text-xs',
      color: 'text-white',
      style: 'font-mono tracking-widest uppercase',
    },

    // Tiêu đề trang (Section Title, vd: "GIỚI THIỆU VỀ TÔI")
    sectionTitle: {
      size: 'text-2xl sm:text-3xl lg:text-4xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-[0.08em] sm:tracking-[0.14em]',
    },

    // Phụ đề trang (Section Subtitle)
    sectionSubtitle: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono tracking-widest uppercase max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2',
    },

    // Đoạn văn tự sự / Bio giới thiệu (About narrative paragraph)
    bio: {
      size: 'text-xs sm:text-sm md:text-base lg:text-lg',
      color: 'text-zinc-200',
      style: 'leading-relaxed font-sans italic',
    },

    // Thống kê / Chỉ số nổi bật: Giá trị chính (Key stat value / highlights)
    statValue: {
      size: 'text-base sm:text-lg md:text-sm lg:text-base xl:text-xl 2xl:text-2xl',
      color: 'text-white',
      style: 'font-black font-mono tracking-tight whitespace-nowrap',
    },

    // Thống kê: Nhãn phụ (Key stat label)
    statLabel: {
      size: 'text-[10px] sm:text-[11px]',
      color: 'text-zinc-400',
      style: 'font-mono uppercase tracking-wider block mt-1 whitespace-nowrap',
    },

    // Nhãn hồ sơ & bảng điểm (Credentials section label)
    credentialsLabel: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono uppercase tracking-wider font-semibold',
    },

    // Nút mở xem Master CV / Bảng điểm (Credentials action buttons)
    credentialsButton: {
      size: 'text-[11px] sm:text-xs',
      color: 'text-white',
      style: 'font-mono font-semibold tracking-wider uppercase',
    },
  },

  /* =========================================================================
     02. SKILLS (Trang Kỹ năng chuyên môn)
     ========================================================================= */
  skills: {
    // Huy hiệu section (vd: "02 / CAPABILITIES & STACK")
    sectionBadge: {
      size: 'text-xs',
      color: 'text-white',
      style: 'font-mono tracking-widest uppercase',
    },

    // Tiêu đề trang (vd: "KỸ NĂNG CHUYÊN MÔN")
    sectionTitle: {
      size: 'text-2xl sm:text-3xl lg:text-4xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-[0.08em] sm:tracking-[0.14em]',
    },

    // Phụ đề trang
    sectionSubtitle: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono tracking-wider uppercase max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2',
    },

    // Số thứ tự danh mục kỹ năng (Category index badge, vd: "//01")
    categoryIndex: {
      size: 'text-[11px] sm:text-xs',
      color: 'text-black',
      style: 'font-mono font-bold',
    },

    // Tên danh mục kỹ năng (Category title, vd: "BACKEND & DISTRIBUTED SYSTEMS")
    categoryTitle: {
      size: 'text-xs sm:text-sm md:text-base',
      color: 'text-white',
      style: 'font-bold tracking-wider uppercase truncate',
    },

    // Số lượng kỹ năng trong nhóm (Category item count, vd: "7 MỤC")
    categoryCount: {
      size: 'text-[10px] sm:text-[11px]',
      color: 'text-zinc-500',
      style: 'font-mono tracking-wider sm:tracking-widest uppercase',
    },

    // Thẻ kỹ năng riêng lẻ (Skill pill item)
    skillPill: {
      size: 'text-[13px] sm:text-[15px]',
      color: 'text-white',
      style: 'font-mono font-medium',
    },

    // Dòng trạng thái chân trang (Footer status bar)
    footerHint: {
      size: 'text-[10px] sm:text-[11px]',
      color: 'text-slate-500',
      style: 'font-mono',
    },
  },

  /* =========================================================================
     03. EXPERIENCE (Trang Kinh nghiệm làm việc)
     ========================================================================= */
  experience: {
    // Huy hiệu section (vd: "03 / CAREER & WORK EXPERIENCE")
    sectionBadge: {
      size: 'text-xs',
      color: 'text-zinc-300',
      style: 'font-mono tracking-widest uppercase',
    },

    // Tiêu đề trang (vd: "KINH NGHIỆM LÀM VIỆC")
    sectionTitle: {
      size: 'text-2xl sm:text-3xl lg:text-4xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-[0.08em] sm:tracking-[0.14em]',
    },

    // Phụ đề trang
    sectionSubtitle: {
      size: 'text-xs sm:text-sm',
      color: 'text-zinc-400',
      style: 'font-mono tracking-wider uppercase max-w-xl lg:max-w-3xl mx-auto leading-relaxed px-2',
    },

    // Loại hình công việc (Type badge: "FULLTIME", "INTERNSHIP")
    typeBadge: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-black',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // TÊN CÔNG TY (Company Name, vd: "FPT Software", "365 EJSC")
    company: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-300',
      style: 'font-mono font-bold uppercase tracking-wider',
    },

    // Thời gian công tác (Employment period, vd: "11/2025 - 09/2026")
    period: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono',
    },

    // Địa điểm làm việc (Location, vd: "Cần Thơ, Việt Nam")
    location: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-300',
      style: 'font-mono uppercase tracking-wider',
    },

    // TÊN CÔNG VIỆC / VAI TRÒ (Role / Job Title, vd: "LẬP TRÌNH VIÊN")
    role: {
      size: 'text-base xs:text-lg sm:text-2xl lg:text-3xl xl:text-4xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-tight leading-tight',
    },

    // NỘI DUNG TÓM TẮT KINH NGHIỆM (Summary / Content)
    summary: {
      size: 'text-xs sm:text-base lg:text-[16px]',
      color: 'text-zinc-300',
      style: 'leading-relaxed font-sans line-clamp-2 xs:line-clamp-3 md:line-clamp-4 max-w-2xl',
    },

    // Tiêu đề phần công nghệ cốt lõi ("CORE TECHNOLOGIES:")
    techHeading: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-zinc-400',
      style: 'font-mono uppercase tracking-widest block font-semibold',
    },

    // Thẻ công nghệ (Tech badge pill)
    techBadge: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-zinc-200',
      style: 'font-mono',
    },

    // Nút xem chi tiết kinh nghiệm (Action button: "XEM CHI TIẾT →")
    detailButton: {
      size: 'text-[10px] xs:text-[11px] sm:text-sm',
      color: 'text-black',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Chân trang: Chỉ số trang (Pagination indicator: "EXP 01 / 02")
    pagination: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono tracking-wider uppercase font-semibold',
    },

    // Nút chuyển kinh nghiệm (Nav buttons: "← PREV", "NEXT →", "RESET ↺")
    navButton: {
      size: 'text-[10px] sm:text-[11px]',
      color: 'text-white',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Ngăn kéo chi tiết chuyên sâu (Deep-dive Drawer Modal)
    drawer: {
      headerBadge: {
        size: 'text-[11px] sm:text-xs',
        color: 'text-zinc-300',
        style: 'font-mono uppercase tracking-widest font-bold',
      },
      closeButton: {
        size: 'text-xs',
        color: 'text-zinc-300',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      typeBadge: {
        size: 'text-[10px] sm:text-[11px]',
        color: 'text-black',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      meta: {
        size: 'text-[11px] sm:text-xs',
        color: 'text-zinc-400',
        style: 'font-mono uppercase tracking-wider',
      },
      role: {
        size: 'text-xl sm:text-2xl md:text-3xl',
        color: 'text-white',
        style: 'font-black uppercase tracking-tight leading-snug pt-1',
      },
      company: {
        size: 'text-xs sm:text-sm',
        color: 'text-zinc-400',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      summary: {
        size: 'text-xs sm:text-sm md:text-base',
        color: 'text-zinc-200',
        style: 'leading-relaxed italic',
      },
      sectionHeading: {
        size: 'text-xs',
        color: 'text-white',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      itemText: {
        size: 'text-xs',
        color: 'text-zinc-300',
        style: 'leading-relaxed font-sans',
      },
    },
  },

  /* =========================================================================
     04. PROJECTS (Trang Dự án cá nhân)
     ========================================================================= */
  projects: {
    // Huy hiệu section (vd: "04 / PERSONAL PROJECTS")
    sectionBadge: {
      size: 'text-xs',
      color: 'text-zinc-300',
      style: 'font-mono tracking-widest uppercase',
    },

    // Tiêu đề trang (vd: "DỰ ÁN CÁ NHÂN")
    sectionTitle: {
      size: 'text-2xl sm:text-3xl lg:text-4xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-[0.08em] sm:tracking-[0.14em]',
    },

    // Phụ đề trang
    sectionSubtitle: {
      size: 'text-xs sm:text-sm',
      color: 'text-zinc-400',
      style: 'font-mono tracking-widest uppercase max-w-xl lg:max-w-3xl mx-auto leading-relaxed px-2',
    },

    // Loại hình dự án (Type badge: "TYPE: INFO", "TYPE: FULLSTACK")
    typeBadge: {
      size: 'text-[9px] sm:text-[10px]',
      color: 'text-black',
      style: 'font-mono font-bold uppercase tracking-widest',
    },

    // Mã số / ID dự án (vd: "#shorter-link")
    projectId: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-zinc-400',
      style: 'font-mono',
    },

    // Danh mục & Năm (Category & Year, vd: "WEB APPLICATION • 2024")
    meta: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-zinc-300',
      style: 'font-mono uppercase tracking-widest font-semibold',
    },

    // TÊN DỰ ÁN (Project Title, vd: "HỆ THỐNG QUẢN LÝ RÚT GỌN LIÊN KẾT")
    title: {
      size: 'text-base xs:text-lg sm:text-2xl lg:text-3xl xl:text-4xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-tight leading-tight',
    },

    // NỘI DUNG TÓM TẮT DỰ ÁN (Summary / Content)
    summary: {
      size: 'text-xs sm:text-base lg:text-[16px]',
      color: 'text-zinc-300',
      style: 'leading-relaxed font-sans line-clamp-2 xs:line-clamp-3 md:line-clamp-4 max-w-2xl whitespace-pre-line',
    },

    // Tiêu đề phần công nghệ ("TECH STACK:")
    techHeading: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-zinc-400',
      style: 'font-mono tracking-widest uppercase block font-semibold',
    },

    // Thẻ công nghệ (Tech badge pill)
    techBadge: {
      size: 'text-[9px] sm:text-[11px]',
      color: 'text-zinc-200',
      style: 'font-mono',
    },

    // Nút khám phá dự án ("KHÁM PHÁ DỰ ÁN →")
    primaryButton: {
      size: 'text-[10px] xs:text-[11px] sm:text-xs',
      color: 'text-black',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Nút xem mã nguồn ("CODE")
    codeButton: {
      size: 'text-[10px] xs:text-[11px] sm:text-xs',
      color: 'text-white',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Chân trang: Chỉ số trang (Pagination indicator: "PAGE 01 / 03")
    pagination: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono tracking-wider uppercase font-semibold',
    },

    // Nút chuyển trang dự án (Nav buttons: "← PREV", "NEXT →")
    navButton: {
      size: 'text-[10px] sm:text-[11px]',
      color: 'text-white',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Ngăn kéo chi tiết dự án (Deep-dive Drawer Modal)
    drawer: {
      headerBadge: {
        size: 'text-[11px] sm:text-xs',
        color: 'text-zinc-300',
        style: 'font-mono uppercase tracking-widest font-bold',
      },
      closeButton: {
        size: 'text-xs',
        color: 'text-zinc-300',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      typeBadge: {
        size: 'text-[10px] sm:text-[11px]',
        color: 'text-black',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      meta: {
        size: 'text-[11px] sm:text-xs',
        color: 'text-zinc-400',
        style: 'font-mono uppercase tracking-wider',
      },
      title: {
        size: 'text-xl sm:text-2xl md:text-3xl',
        color: 'text-white',
        style: 'font-black uppercase tracking-tight leading-snug pt-1',
      },
      category: {
        size: 'text-xs sm:text-sm',
        color: 'text-zinc-400',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      summary: {
        size: 'text-xs sm:text-sm md:text-base',
        color: 'text-zinc-200',
        style: 'leading-relaxed italic',
      },
      sectionHeading: {
        size: 'text-xs',
        color: 'text-white',
        style: 'font-mono font-bold tracking-widest uppercase',
      },
      featureTitle: {
        size: 'text-xs sm:text-sm',
        color: 'text-white',
        style: 'font-mono font-bold',
      },
      featureDescription: {
        size: 'text-xs',
        color: 'text-zinc-300',
        style: 'leading-relaxed font-sans',
      },
    },
  },

  /* =========================================================================
     05. CONTACT (Trang Liên hệ & Chân trang)
     ========================================================================= */
  contact: {
    // Huy hiệu section (vd: "05 / GET IN TOUCH")
    sectionBadge: {
      size: 'text-xs',
      color: 'text-zinc-300',
      style: 'font-mono tracking-widest uppercase',
    },

    // Tiêu đề trang (vd: "LIÊN HỆ & HỢP TÁC")
    sectionTitle: {
      size: 'text-2xl sm:text-4xl lg:text-5xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-[0.12em]',
    },

    // Phụ đề trang
    sectionSubtitle: {
      size: 'text-[11px] sm:text-xs md:text-sm',
      color: 'text-zinc-400',
      style: 'font-mono uppercase tracking-widest max-w-lg lg:max-w-2xl mx-auto leading-relaxed px-2',
    },

    // Tên nhãn kênh liên hệ (Card channel label: "Email", "GitHub Profile", "LinkedIn Profile")
    cardLabel: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono font-bold uppercase tracking-widest block',
    },

    // Giá trị kênh liên hệ (Card channel value: "duongdoanthuan2003@gmail.com", "@ayana0409", "@thuanduongdev")
    cardValue: {
      size: 'text-xs sm:text-sm',
      color: 'text-white',
      style: 'font-semibold font-mono block mt-0.5 tracking-wider break-all',
    },

    // Bản quyền footer ("© 2026 DƯƠNG ĐOÀN THUẬN. ALL RIGHTS RESERVED.")
    footerCopyright: {
      size: 'text-[11px] sm:text-xs',
      color: 'text-zinc-400',
      style: 'font-mono tracking-wider uppercase',
    },

    // Danh sách công nghệ footer ("React 19 • Tailwind CSS • GSAP 3D")
    footerTech: {
      size: 'text-[10px] sm:text-[11px]',
      color: 'text-zinc-500',
      style: 'font-mono font-bold',
    },
  },

  /* =========================================================================
     06. DOCUMENTS MODAL (Hộp thoại Hồ sơ & Tài liệu Google Drive)
     ========================================================================= */
  documents: {
    // Huy hiệu modal (vd: "GOOGLE DRIVE CREDENTIALS")
    headerBadge: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-white',
      style: 'font-mono font-bold tracking-widest uppercase',
    },

    // Tiêu đề modal (vd: "HỒ SƠ & TÀI LIỆU")
    title: {
      size: 'text-xl sm:text-2xl md:text-3xl',
      color: 'text-white',
      style: 'font-black uppercase tracking-tight pt-1',
    },

    // Phụ đề modal
    subtitle: {
      size: 'text-xs sm:text-sm',
      color: 'text-zinc-400',
      style: 'font-sans max-w-xl',
    },

    // Huy hiệu thẻ tài liệu (vd: "VERIFIED PDF", "TRANSCRIPT")
    cardBadge: {
      size: 'text-[9px] sm:text-[10px]',
      color: 'text-white',
      style: 'font-mono font-bold uppercase tracking-wider',
    },

    // Tiêu đề thẻ tài liệu (vd: "Master CV", "Bảng điểm đại học")
    cardTitle: {
      size: 'text-base sm:text-lg',
      color: 'text-white',
      style: 'font-bold uppercase tracking-wide',
    },

    // Mô tả tài liệu
    cardDescription: {
      size: 'text-xs',
      color: 'text-zinc-400',
      style: 'leading-relaxed font-sans',
    },

    // Nút mở Google Drive / Tải xuống
    actionButton: {
      size: 'text-[10px] sm:text-xs',
      color: 'text-white',
      style: 'font-mono font-bold tracking-wider uppercase',
    },
  },
}

/**
 * Helper function to compile the nested typography configuration into direct,
 * high-performance Tailwind CSS utility class strings.
 * 
 * Resulting structure:
 * `typography.hero.name` -> string of merged Tailwind classes
 */
function compileTypography(config) {
  const result = {}

  for (const [sectionKey, sectionValue] of Object.entries(config)) {
    if (sectionValue && typeof sectionValue === 'object') {
      result[sectionKey] = {}

      for (const [itemKey, itemValue] of Object.entries(sectionValue)) {
        if (itemValue && typeof itemValue === 'object') {
          // If node has size/color/style properties
          if ('size' in itemValue || 'color' in itemValue || 'style' in itemValue) {
            result[sectionKey][itemKey] = [
              itemValue.size,
              itemValue.color,
              itemValue.style,
            ]
              .filter(Boolean)
              .join(' ')
              .trim()
              .replace(/\s+/g, ' ')
          } else {
            // Nested sub-object (e.g. drawer)
            result[sectionKey][itemKey] = {}
            for (const [subKey, subValue] of Object.entries(itemValue)) {
              if (subValue && typeof subValue === 'object') {
                result[sectionKey][itemKey][subKey] = [
                  subValue.size,
                  subValue.color,
                  subValue.style,
                ]
                  .filter(Boolean)
                  .join(' ')
                  .trim()
                  .replace(/\s+/g, ' ')
              } else {
                result[sectionKey][itemKey][subKey] = subValue
              }
            }
          }
        } else {
          result[sectionKey][itemKey] = itemValue
        }
      }
    } else {
      result[sectionKey] = sectionValue
    }
  }

  return result
}

// Pre-compiled typography strings for zero-overhead usage in components
export const typography = compileTypography(typographyConfig)

export default typography
