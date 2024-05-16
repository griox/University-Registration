import React, { useEffect, useState } from 'react';
import '../../assets/css/style.css';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
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

    useEffect(() => {
        window.addEventListener('scroll', calcScrollValue);
        window.addEventListener('load', calcScrollValue);

        return () => {
            window.removeEventListener('scroll', calcScrollValue);
            window.removeEventListener('load', calcScrollValue);
        };
    }, []);

    const scrollToTop = () => {
        const scrollStep = -window.scrollY / (500 / 15);
        const scrollInterval = setInterval(() => {
            if (window.scrollY !== 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 15);
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
                <style>
                    {`
                        #progress {
                            position: fixed;
                            bottom: 20px;
                            right: 10px;
                            height: 70px;
                            width: 70px;
                            display: ${isVisible ? 'grid' : 'none'};
                            place-items: center;
                            border-radius: 50%;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
                            cursor: pointer;
                            background: conic-gradient(#03cc65 ${scrollValue}%, #d7d7d7 ${scrollValue}%);
                        }
                        #progress-value {
                            display: block;
                            height: calc(100% - 15px);
                            width: calc(100% - 15px);
                            background-color: #ffffff;
                            border-radius: 50%;
                            display: grid;
                            place-items: center;
                            font-size: 35px;
                            color: #001a2e;
                        }
                    `}
                </style>
                <div id="progress" onClick={scrollToTop}>
                    <span id="progress-value">&#x1F815;</span>
                </div>

                {/* HERO & NAVBAR */}

                <section id="hero" className="min-vh-100 d-flex flex-column align-items-center">
                    {/* NAVBAR */}
                    <nav
                        className="navbar navbar-expand-lg bg-light sticky-top"
                        style={{
                            width: '100%',
                            height: '60px',
                            position: 'fixed',
                            zIndex: '1000',
                            backgroundColor: 'transparent',
                        }}
                    >
                        <div className="container" style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                                <a
                                    href="login"
                                    style={{ fontSize: '17px', borderRadius: '10px' }}
                                    className="btn btn-brand ms-lg-3"
                                >
                                    Đăng Nhập
                                </a>
                            </div>
                        </div>
                    </nav>

                    <div
                        className="container flex-grow-1 d-flex align-items-center justify-content-center"
                        style={{ paddingTop: '150px' }}
                    >
                        <div className="row">
                            <div className="col-12">
                                <h1
                                    data-text="Xin chào"
                                    data-aos="fade-left"
                                    className="text-uppercase text-white fw-semibold display-1"
                                >
                                    Lan tỏa tác động <br /> truyền cảm hứng
                                </h1>
                                <h5 className="intro text-white mt-3 mb-4" data-aos="fade-right">
                                    Chúng tôi ở đây để giúp bạn dễ dàng hơn trong việc lựa chọn trường phù hợp cho mình
                                </h5>
                            </div>
                        </div>
                    </div>
                </section>

                {/* VIDEO INTRO */}
                <section style={{ paddingTop: '180px' }} id="intro" class="section-padding border-top">
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6" data-aos="fade-down" data-aos-delay="150">
                                <div class="section-video">
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
                                class="col-md-6 text-center d-flex align-items-center"
                                data-aos="fade-down"
                                data-aos-delay="150"
                            >
                                <div class="section-title-1">
                                    <h1 class="fw-semibold fs-1">
                                        Nơi khai phóng cho <br /> những cải tiến đột phá
                                    </h1>
                                    <div class="line"></div>
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

                <section id="achieve" class="section-padding">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center" data-aos="fade-down" data-aos-delay="150">
                                <div class="section-title-2">
                                    <h1 class="display-4 fw-semibold">Đôi nét về FPT University</h1>
                                    <div class="line"></div>
                                    <p>Những cột mốc đáng nhớ trên suốt hành trình 29 năm truyền cảm hứng của FPT</p>
                                </div>
                            </div>
                        </div>
                        <div class="row g-4 text-center">
                            <div class="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    class="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/press-release/fpt-to-shape-the-future-of-ai-and-cloud-on-a-global-scale-in-collaboration-with-nvidia')"
                                >
                                    <div class="iconbox">
                                        <img src="../assets/images/b1.png" alt="" />
                                    </div>
                                    <h5 class="mt-4 mb-3">Future of AI and Cloud</h5>
                                    <p>
                                        FPT to Shape the Future of AI and Cloud on a Global Scale in Collaboration with
                                        NVIDIA
                                    </p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    class="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-software-bolsters-digital-transformation-capabilities-with-double-recognitions-in-microsoft-azure-advanced-specialisation')"
                                >
                                    <div class="iconbox">
                                        <img src="../assets/images/b2.png" alt="" />
                                    </div>
                                    <h5 class="mt-4 mb-3">Digital Transformation</h5>
                                    <p>
                                        FPT Software Bolsters Digital Transformation Capabilities with Double
                                        Recognitions in Microsoft Azure
                                    </p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    class="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/press-release/fpt-cooperates-with-usaid-to-promote-clean-energy-deployment-reduce-greenhouse-gas-emissions-and-accelerate-net-zero-transition')"
                                >
                                    <div class="iconbox">
                                        <img src="../assets/images/b3.png" alt="" />
                                    </div>
                                    <h5 class="mt-4 mb-3">Cooperates with USAID</h5>
                                    <p>
                                        FPT Cooperates with USAID to Promote Clean Energy Deployment, Reduce Greenhouse
                                        Gas Emissions
                                    </p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    class="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-software-japan-becomes-outsystems-premier-partner')"
                                >
                                    <div class="iconbox">
                                        <img src="../assets/images/b4.png" alt="" />
                                    </div>
                                    <h5 class="mt-4 mb-3">OutSystems Premier Partner</h5>
                                    <p>
                                        FPT Software Japan, a subsidiary of global IT service provider FPT Software,
                                        recognized as a Premier Partner
                                    </p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    class="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-automotive-and-vinai-partner-to-amplify-comprehensive-offerings-to-oems')"
                                >
                                    <div class="iconbox">
                                        <img src="../assets/images/b5.png" alt="" />
                                    </div>
                                    <h5 class="mt-4 mb-3">Partner</h5>
                                    <p>FPT Automotive and VinAI Partner to Amplify Comprehensive Offerings to OEMs</p>
                                </div>
                            </div>

                            <div class="col-lg-4 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <div
                                    class="service theme-shadow p-lg-5 p-4"
                                    onclick="openLink('https://fptsoftware.com/newsroom/news-and-press-releases/news/fpt-korea-seizing-korean-automotive-potentials-with-reach-global-leverage-local-approach')"
                                >
                                    <div class="iconbox">
                                        <img src="../assets/images/b6.png" alt="" />
                                    </div>
                                    <h5 class="mt-4 mb-3">Reach Global, Leverage Local</h5>
                                    <p>
                                        FPT Korea: Seizing Korean Automotive Potentials with “Reach Global, Leverage
                                        Local" Approach
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="counter" class="section-padding">
                    <div class="container text-center">
                        <div class="row g-4">
                            <div class="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="150">
                                <h1 class="text-white display-4">40,00+</h1>
                                <h6 class="text-uppercase mb-0 text-white mt-3">Sinh viên theo học</h6>
                            </div>
                            <div class="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="250">
                                <h1 class="text-white display-4">20+</h1>
                                <h6 class="text-uppercase mb-0 text-white mt-3">Ngành đào tạo đại học</h6>
                            </div>
                            <div class="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="350">
                                <h1 class="text-white display-4">2000</h1>
                                <h6 class="text-uppercase mb-0 text-white mt-3">Hồ sơ sinh viên gửi về mỗi năm</h6>
                            </div>
                            <div class="col-lg-3 col-sm-6" data-aos="fade-down" data-aos-delay="450">
                                <h1 class="text-white display-4">Trên 98%</h1>
                                <h6 class="text-uppercase mb-0 text-white mt-3">Sinh viên ra trường có việc làm</h6>
                            </div>
                        </div>
                    </div>
                </section>

                <section class="section-padding bg-light" id="contact">
                    <div class="container">
                        <div class="row">
                            <div class="col-12 text-center" data-aos="fade-down" data-aos-delay="150">
                                <div class="section-title-4">
                                    <h1 class="display-4 text-white fw-semibold">Liên Hệ Với Chúng Tôi</h1>
                                    <div class="line bg-white"></div>
                                    <p class="text-white">
                                        Chúng tôi rất sẵn lòng lắng nghe những góp ý cũng như ý kiến của bạn sau khi
                                        trải nghiệm hệ thống của chúng tôi.
                                    </p>
                                </div>
                            </div>
                        </div>
                        <br />
                        <div class="row justify-content-center" data-aos="fade-down" data-aos-delay="250">
                            <div class="col-lg-8 change">
                                <form action="#" class="row g-3 p-lg-5 p-4 theme-shadow">
                                    <div class="form-group col-lg-6">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="text"
                                            class="form-control"
                                            placeholder="Enter first name"
                                        />
                                    </div>
                                    <div class="form-group col-lg-6">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="text"
                                            class="form-control"
                                            placeholder="Enter last name"
                                        />
                                    </div>
                                    <div class="form-group col-lg-12">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="email"
                                            class="form-control"
                                            placeholder="Enter Email address"
                                        />
                                    </div>
                                    <div class="form-group col-lg-12">
                                        <input
                                            style={{ borderRadius: '10px' }}
                                            type="text"
                                            class="form-control"
                                            placeholder="Enter subject"
                                        />
                                    </div>
                                    <div class="form-group col-lg-12">
                                        <textarea
                                            style={{ borderRadius: '10px' }}
                                            name="message"
                                            rows="5"
                                            class="form-control"
                                            placeholder="Enter Message"
                                        ></textarea>
                                    </div>
                                    <div class="form-group col-lg-12 d-grid">
                                        <button class="btn btn-brand" style={{ borderRadius: '10px' }}>
                                            Gửi yêu cầu
                                        </button>
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
                                    <a href="#">
                                        <img src="./assets/images/fptnew.png" width="250" height="150" alt="" />
                                    </a>
                                    <div className="line" style={{ width: '100px' }}></div>
                                    <div className="social-icons">
                                        <a href="#">
                                            <i className="ri-twitter-fill"></i>
                                        </a>
                                        <a href="#">
                                            <i className="ri-instagram-fill"></i>
                                        </a>
                                        <a href="#">
                                            <i className="ri-github-fill"></i>
                                        </a>
                                        <a href="#">
                                            <i className="ri-dribbble-fill"></i>
                                        </a>
                                    </div>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">SERVICES</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>
                                            <a href="#">UI Design</a>
                                        </li>
                                        <li>
                                            <a href="#">UX Design</a>
                                        </li>
                                        <li>
                                            <a href="#">Branding</a>
                                        </li>
                                        <li>
                                            <a href="#">Logo Designing</a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="col-lg-3 col-sm-6">
                                    <h5 className="mb-0 text-white">ABOUT</h5>
                                    <div className="line"></div>
                                    <ul>
                                        <li>
                                            <a href="#">Blog</a>
                                        </li>
                                        <li>
                                            <a href="#">Services</a>
                                        </li>
                                        <li>
                                            <a href="#">Company</a>
                                        </li>
                                        <li>
                                            <a href="#">Career</a>
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

                {/* <div className="snowflakes" aria-hidden="true">
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                    <div className="snowflake">❅</div>
                    <div className="snowflake">❆</div>
                </div>

                <style>
                    {`
            @-webkit-keyframes snowflakes-fall {
              0% {top:-10%}
              100% {top:100%}
            }
            @-webkit-keyframes snowflakes-shake {
              0%,100% {-webkit-transform:translateX(0);transform:translateX(0)}
              50% {-webkit-transform:translateX(80px);transform:translateX(80px)}
            }
            @keyframes snowflakes-fall {
              0% {top:-10%}
              100% {top:100%}
            }
            @keyframes snowflakes-shake {
              0%,100%{ transform:translateX(0)}
              50% {transform:translateX(80px)}
            }
            .snowflake {
              color: #fff;
              font-size: 1em;
              font-family: Arial, sans-serif;
              text-shadow: 0 0 5px #000;
              position:fixed;
              top:-10%;
              z-index:9999;
              -webkit-user-select:none;
              -moz-user-selexact:none;
              -ms-user-select:none;
              user-select:none;
              cursor:default;
              -webkit-animation-name:snowflakes-fall,snowflakes-shake;
              -webkit-animation-duration:10s,3s;
              -webkit-animation-timing-function:linear,ease-in-out;
              -webkit-animation-iteration-count:infinite,infinite;
              -webkit-animation-play-state:running,running;
              animation-name:snowflakes-fall,snowflakes-shake;
              animation-duration:10s,3s;
              animation-timing-function:linear,ease-in-out;
              animation-iteration-count:infinite,infinite;
              animation-play-state:running,running;
            }
            .snowflake:nth-of-type(0){
              left:1%;-webkit-animation-delay:0s,0s;animation-delay:0s,0s
            }
            .snowflake:nth-of-type(1){
              left:10%;-webkit-animation-delay:1s,1s;animation-delay:1s,1s
            }
            .snowflake:nth-of-type(2){
              left:20%;-webkit-animation-delay:6s,.5s;animation-delay:6s,.5s
            }
            .snowflake:nth-of-type(3){
              left:30%;-webkit-animation-delay:4s,2s;animation-delay:4s,2s
            }
            .snowflake:nth-of-type(4){
              left:40%;-webkit-animation-delay:2s,2s;animation-delay:2s,2s
            }
            .snowflake:nth-of-type(5){
              left:50%;-webkit-animation-delay:8s,3s;animation-delay:8s,3s
            }
            .snowflake:nth-of-type(6){
              left:60%;-webkit-animation-delay:6s,2s;animation-delay:6s,2s
            }
            .snowflake:nth-of-type(7){
              left:70%;-webkit-animation-delay:2.5s,1s;animation-delay:2.5s,1s
            }
            .snowflake:nth-of-type(8){
              left:80%;-webkit-animation-delay:1s,0s;animation-delay:1s,0s
            }
            .snowflake:nth-of-type(9){
              left:90%;-webkit-animation-delay:3s,1.5s;animation-delay:3s,1.5s
            }
            .snowflake:nth-of-type(10){
              left:25%;-webkit-animation-delay:2s,0s;animation-delay:2s,0s
            }
            .snowflake:nth-of-type(11){
              left:65%;-webkit-animation-delay:4s,2.5s;animation-delay:4s,2.5s
            }
          `}
                </style> */}

                <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"></script>
                <script src="https://cdn.jsdelivr.net/npm/@fancyapps/ui@4.0/dist/fancybox.umd.js"></script>
                <script src="https://unpkg.com/aos@next/dist/aos.js"></script>
                <script src="./assets/js/main.js"></script>
            </body>
        </>
    );
};

export default Home;
