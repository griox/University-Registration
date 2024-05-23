import React, { useEffect, useState } from 'react';
// import '../../assets/css/style.css';
import { Helmet } from 'react-helmet';
import { Link, useHistory } from 'react-router-dom';
import AOS from 'aos';

const Home = () => {
    useEffect(() => {
        AOS.init({
            offset: 120,
            delay: 0,
            duration: 900,
            easing: 'ease',
            once: false,
            mirror: false,
            anchorPlacement: 'top-bottom',
        });
    }, []);

    const history = useHistory();

    const [scrollValue, setScrollValue] = useState(0);
    const [isVisible, setIsVisible] = useState(false);

    const calcScrollValue = () => {
        const pos = document.documentElement.scrollTop;
        const calcHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const newScrollValue = Math.round((pos * 100) / calcHeight);
        setScrollValue(newScrollValue);
        setIsVisible(pos > 100);
        const scrollProgress = document.getElementById('progress');
        scrollProgress.style.background = `conic-gradient(#03cc65 ${newScrollValue}%, #d7d7d7 ${newScrollValue}%)`;
    };

    return (
        <>
            <Helmet>
                <meta charset="utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <title>HOME | Trang Chủ</title>
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/css/bootstrap.min.css" />
                <link href="https://cdn.jsdelivr.net/npm/remixicon@2.5.0/fonts/remixicon.css" rel="stylesheet" />
                <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.css" />
                <link rel="stylesheet" href="https://unpkg.com/aos@next/dist/aos.css" />
                <link rel="stylesheet" href="assets/css/style.css" />
            </Helmet>
            <body data-bs-spy="scroll" data-bs-target=".navbar">
                <section id="hero" className="min-vh-100 d-flex flex-column align-items-center">
                    <nav className="navbar navbar-expand-lg bg-white sticky-top fixnavbar">
                        <div className="container">
                            <Link className="navbar-brand" to="/">
                                <img src="./assets/images/fptnew.png" width="150" height="150" alt="FPT Logo" />
                            </Link>
                            <button
                                className="navbar-toggler"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target="#navbarNav"
                                aria-controls="navbarNav"
                                aria-expanded="false"
                                aria-label="Toggle navigation"
                            >
                                <span className="navbar-toggler-icon"></span>
                            </button>
                            <div className="collapse navbar-collapse" id="navbarNav">
                                <ul className="navbar-nav ms-auto">
                                    <li className="nav-item">
                                        <a className="nav-link" href="#hero">
                                            Trang Chủ
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#intro">
                                            Giới thiệu
                                        </a>
                                    </li>
                                    <li className="nav-item">
                                        <a className="nav-link" href="#contact">
                                            Liên Hệ
                                        </a>
                                    </li>
                                </ul>
                                <button
                                    onClick={() => history.push('/Login')}
                                    className="btn btn-brand ms-lg-3 logincss"
                                >
                                    Đăng Nhập
                                </button>
                            </div>
                        </div>
                    </nav>

                    <div className="container bannerfix flex-grow-1 d-flex align-items-center justify-content-center">
                        <div className="row">
                            <div className="col-12">
                                <h1 className="text-uppercase text-white fw-semibold display-1">
                                    Lan tỏa tác động <br /> truyền cảm hứng
                                </h1>
                                <h5 className="intro text-white mt-3 mb-4" data-aos="fade-right">
                                    Chúng tôi ở đây để giúp bạn dễ dàng hơn trong việc lựa chọn trường phù hợp cho mình
                                </h5>
                            </div>
                        </div>
                    </div>
                </section>

                <section style={{ paddingTop: '180px' }} id="intro" className="section-padding border-top">
                    <div className="container">
                        <div className="row">
                            <div className="col-md-6" data-aos="fade-down" data-aos-delay="150">
                                <div className="section-video">
                                    <iframe
                                        width="100%"
                                        height="450px"
                                        src="https://www.youtube.com/embed/SdtTU7UPCC0?autoplay=1&amp;showinfo=0&amp;autohide=1?vq=hd1080&amp;mute=1"
                                        title="Giới thiệu tổng quan các ngành học tại Đại học FPT 2023"
                                        frameborder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        referrerpolicy="strict-origin-when-cross-origin"
                                        allowfullscreen
                                    ></iframe>
                                </div>
                            </div>
                            <div
                                className="col-md-6 text-center d-flex align-items-center"
                                data-aos="fade-down"
                                data-aos-delay="150"
                            >
                                <div className="section-title-1">
                                    <h1 className="fw-semibold fs-1">
                                        Nơi khai phóng cho <br /> những cải tiến đột phá
                                    </h1>
                                    <div className="line"></div>
                                    <p>
                                        Bên cạnh trang bị nền tảng kiến thức và kỹ năng chuyên môn, FPT University luôn
                                        chú trọng cả về hình thành và phát triển tư duy nghiên cứu của người học, giúp
                                        họ nhạy bén với các ý tưởng và tạo bệ phóng cho những cải tiến đột phá nhất.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="achieve" className="section-padding">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center" data-aos="fade-down" data-aos-delay="150">
                                <div className="section-title-2">
                                    <h1 className="display-4 fw-semibold">Đôi nét về FPT University</h1>
                                    <div className="line"></div>
                                    <p>Những cột mốc đáng nhớ trên suốt hành trình 29 năm truyền cảm hứng của FPT</p>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4 text-center">
                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    className="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/press-release/fpt-to-shape-the-future-of-ai-and-cloud-on-a-global-scale-in-collaboration-with-nvidia')"
                                >
                                    <div className="iconbox">
                                        <img src="../assets/images/b1.png" alt="" />
                                    </div>
                                    <h5 className="mt-4 mb-3">Future of AI and Cloud</h5>
                                    <p>
                                        FPT to Shape the Future of AI and Cloud on a Global Scale in Collaboration with
                                        NVIDIA
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    className="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-software-bolsters-digital-transformation-capabilities-with-double-recognitions-in-microsoft-azure-advanced-specialisation')"
                                >
                                    <div className="iconbox">
                                        <img src="../assets/images/b2.png" alt="" />
                                    </div>
                                    <h5 className="mt-4 mb-3">Digital Transformation</h5>
                                    <p>
                                        FPT Software Bolsters Digital Transformation Capabilities with Double
                                        Recognitions in Microsoft Azure
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    className="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/press-release/fpt-cooperates-with-usaid-to-promote-clean-energy-deployment-reduce-greenhouse-gas-emissions-and-accelerate-net-zero-transition')"
                                >
                                    <div className="iconbox">
                                        <img src="../assets/images/b3.png" alt="" />
                                    </div>
                                    <h5 className="mt-4 mb-3">Cooperates with USAID</h5>
                                    <p>
                                        FPT Cooperates with USAID to Promote Clean Energy Deployment, Reduce Greenhouse
                                        Gas Emissions
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    className="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-software-japan-becomes-outsystems-premier-partner')"
                                >
                                    <div className="iconbox">
                                        <img src="../assets/images/b4.png" alt="" />
                                    </div>
                                    <h5 className="mt-4 mb-3">OutSystems Premier Partner</h5>
                                    <p>
                                        FPT Software Japan, a subsidiary of global IT service provider FPT Software,
                                        recognized as a Premier Partner
                                    </p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    className="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-automotive-and-vinai-partner-to-amplify-comprehensive-offerings-to-oems')"
                                >
                                    <div className="iconbox">
                                        <img src="../assets/images/b5.png" alt="" />
                                    </div>
                                    <h5 className="mt-4 mb-3">Partner</h5>
                                    <p>FPT Automotive and VinAI Partner to Amplify Comprehensive Offerings to OEMs</p>
                                </div>
                            </div>

                            <div className="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    className="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-korea-seizing-korean-automotive-potentials-with-reach-global-leverage-local-approach')"
                                >
                                    <div className="iconbox">
                                        <img src="../assets/images/b6.png" alt="" />
                                    </div>
                                    <h5 className="mt-4 mb-3">Reach Global, Leverage Local</h5>
                                    <p>
                                        FPT Korea: Seizing Korean Automotive Potentials with “Reach Global, Leverage
                                        Local" Approach
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="counter" className="section-padding">
                    <div className="container text-center">
                        <div className="row g-4">
                            <div className="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <h1 className="text-white display-4">40,00+</h1>
                                <h6 className="text-uppercase mb-0 text-white mt-3">Sinh viên theo học</h6>
                            </div>
                            <div className="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="250">
                                <h1 className="text-white display-4">20+</h1>
                                <h6 className="text-uppercase mb-0 text-white mt-3">Ngành đào tạo đại học</h6>
                            </div>
                            <div className="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="350">
                                <h1 className="text-white display-4">2000</h1>
                                <h6 className="text-uppercase mb-0 text-white mt-3">Hồ sơ sinh viên gửi về mỗi năm</h6>
                            </div>
                            <div className="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="450">
                                <h1 className="text-white display-4">Trên 98%</h1>
                                <h6 className="text-uppercase mb-0 text-white mt-3">Sinh viên ra trường có việc làm</h6>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="section-padding bg-light" id="contact">
                    <div className="container">
                        <div className="row">
                            <div className="col-12 text-center" data-aos="fade-down" data-aos-delay="150">
                                <div className="section-title-4">
                                    <h1 className="display-4 text-white fw-semibold">Liên Hệ Với Chúng Tôi</h1>
                                    <div className="line bg-white"></div>
                                    <p className="text-white">
                                        Chúng tôi rất sẵn lòng lắng nghe những góp ý cũng như ý kiến của bạn sau khi
                                        trải nghiệm hệ thống của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div className="row justify-content-center" data-aos="fade-down" data-aos-delay="250">
                            <div className="col-lg-8 change">
                                <form action="#" className="row g-3 p-lg-5 p-4 theme-shadow">
                                    <div className="form-group inputfix col-lg-6">
                                        <input type="text" className="form-control" placeholder="Enter first name" />
                                    </div>
                                    <div className="form-group col-lg-6">
                                        <input type="text" className="form-control" placeholder="Enter last name" />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="Enter Email address"
                                        />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <input type="text" className="form-control" placeholder="Enter subject" />
                                    </div>
                                    <div className="form-group col-lg-12">
                                        <textarea
                                            name="message"
                                            rows="5"
                                            className="form-control"
                                            placeholder="Enter Message"
                                        ></textarea>
                                    </div>
                                    <div className="form-group col-lg-12 d-grid">
                                        <button className="btn btn-brand btnfix">Gửi yêu cầu</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </section>

                <footer className="bg-dark">
                    <div className="footer-top">
                        <div className="container">
                            <div className="row gy-5">
                                <div className="col-lg-3 col-sm-6">
                                    <img src="./assets/images/fptnew.png" width="250" height="150" alt="" />
                                    <div className="line" style={{ width: '100px' }}></div>
                                    <div className="social-icons">
                                        <Link to="/">
                                            <i className="ri-twitter-fill"></i>
                                        </Link>
                                        <Link to="/">
                                            <i className="ri-instagram-fill"></i>
                                        </Link>
                                        <Link to="/">
                                            <i className="ri-github-fill"></i>
                                        </Link>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">SERVICES</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>
                                            <Link to="/">UI Design</Link>
                                        </li>
                                        <li>
                                            <Link to="/">UX Design</Link>
                                        </li>
                                        <li>
                                            <Link to="/">Demo Design</Link>
                                        </li>
                                        <li>
                                            <Link to="/">Logo Design</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">ABOUT</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>
                                            <Link to="/">Blog</Link>
                                        </li>
                                        <li>
                                            <Link to="/">Services</Link>
                                        </li>
                                        <li>
                                            <Link to="/">Company</Link>
                                        </li>
                                        <li>
                                            <Link to="/">Career</Link>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">CONTACT</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>New York, NY 3300</li>
                                        <li>(414) 586 - 3017</li>
                                        <li>www.example.com</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="footer-bottom">
                        <div className="container">
                            <div className="row g-4 justify-content-between">
                                <div className="col-auto">
                                    <p className="mb-0">© Copyright Group B. All Rights Reserved</p>
                                </div>
                                <div className="col-auto">
                                    <p className="mb-0">Designed with 💜 Group B</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"></script>
                <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
                <script src="./assets/js/main.js"></script>
            </body>
        </>
    );
};

export default Home;
