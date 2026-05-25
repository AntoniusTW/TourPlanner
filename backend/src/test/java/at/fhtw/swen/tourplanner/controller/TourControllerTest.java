package at.fhtw.swen.tourplanner.controller;

import at.fhtw.swen.tourplanner.dto.TourDto;
import at.fhtw.swen.tourplanner.exception.TourNotFoundException;
import at.fhtw.swen.tourplanner.model.TransportType;
import at.fhtw.swen.tourplanner.service.TourService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(value = TourController.class, properties = "tour.images.upload-dir=./test-uploads")
class TourControllerTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @MockitoBean
    private TourService tourService;

    private static final UUID ID = UUID.fromString("aaaaaaaa-bbbb-cccc-dddd-eeeeeeeeeeee");

    private TourDto sampleDto() {
        return TourDto.builder()
                .id(ID)
                .name("Wienerwald Tour")
                .fromLocation("Wien")
                .toLocation("Baden")
                .transportType(TransportType.WALKING)
                .distance(25.0)
                .estimatedTime(300)
                .build();
    }

    private TourDto validInput() {
        return TourDto.builder()
                .name("Neue Tour")
                .fromLocation("Wien")
                .toLocation("Graz")
                .transportType(TransportType.CAR)
                .build();
    }

    // ── GET /api/tours ────────────────────────────────────────────────────────

    @Test
    void getAll_returnsOkWithJsonArray() throws Exception {
        when(tourService.findAll()).thenReturn(List.of(sampleDto()));

        mockMvc.perform(get("/api/tours"))
                .andExpect(status().isOk())
                .andExpect(content().contentType(MediaType.APPLICATION_JSON))
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$[0].id").value(ID.toString()))
                .andExpect(jsonPath("$[0].name").value("Wienerwald Tour"))
                .andExpect(jsonPath("$[0].transportType").value("WALKING"));
    }

    @Test
    void getAll_emptyList_returnsEmptyArray() throws Exception {
        when(tourService.findAll()).thenReturn(List.of());

        mockMvc.perform(get("/api/tours"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray())
                .andExpect(jsonPath("$").isEmpty());
    }

    // ── GET /api/tours/{id} ───────────────────────────────────────────────────

    @Test
    void getById_exists_returnsOkWithTourFields() throws Exception {
        when(tourService.findById(ID)).thenReturn(sampleDto());

        mockMvc.perform(get("/api/tours/{id}", ID))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID.toString()))
                .andExpect(jsonPath("$.name").value("Wienerwald Tour"))
                .andExpect(jsonPath("$.fromLocation").value("Wien"))
                .andExpect(jsonPath("$.toLocation").value("Baden"))
                .andExpect(jsonPath("$.distance").value(25.0))
                .andExpect(jsonPath("$.estimatedTime").value(300));
    }

    @Test
    void getById_notFound_returns404WithErrorBody() throws Exception {
        when(tourService.findById(ID)).thenThrow(new TourNotFoundException(ID));

        mockMvc.perform(get("/api/tours/{id}", ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists())
                .andExpect(jsonPath("$.timestamp").exists());
    }

    // ── POST /api/tours ───────────────────────────────────────────────────────

    @Test
    void create_validDto_returnsCreatedWithBody() throws Exception {
        when(tourService.create(any())).thenReturn(sampleDto());

        mockMvc.perform(post("/api/tours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInput())))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").value(ID.toString()))
                .andExpect(jsonPath("$.name").value("Wienerwald Tour"));
    }

    @Test
    void create_missingName_returns400WithFieldError() throws Exception {
        TourDto input = TourDto.builder()
                .fromLocation("Wien").toLocation("Graz")
                .transportType(TransportType.CAR)
                .build();

        mockMvc.perform(post("/api/tours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.errors.name").exists());
    }

    @Test
    void create_emptyBody_returns400WithAllRequiredFieldErrors() throws Exception {
        mockMvc.perform(post("/api/tours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.fromLocation").exists())
                .andExpect(jsonPath("$.errors.toLocation").exists())
                .andExpect(jsonPath("$.errors.transportType").exists());
    }

    @Test
    void create_missingTransportType_returns400() throws Exception {
        TourDto input = TourDto.builder()
                .name("Tour").fromLocation("Wien").toLocation("Graz")
                .build();

        mockMvc.perform(post("/api/tours")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(input)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.transportType").exists());
    }

    // ── PUT /api/tours/{id} ───────────────────────────────────────────────────

    @Test
    void update_validDto_returnsOk() throws Exception {
        when(tourService.update(eq(ID), any())).thenReturn(sampleDto());

        mockMvc.perform(put("/api/tours/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInput())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID.toString()));
    }

    @Test
    void update_notFound_returns404() throws Exception {
        when(tourService.update(eq(ID), any())).thenThrow(new TourNotFoundException(ID));

        mockMvc.perform(put("/api/tours/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validInput())))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404));
    }

    @Test
    void update_invalidBody_returns400() throws Exception {
        mockMvc.perform(put("/api/tours/{id}", ID)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors").exists());
    }

    // ── DELETE /api/tours/{id} ────────────────────────────────────────────────

    @Test
    void delete_exists_returnsNoContent() throws Exception {
        doNothing().when(tourService).delete(ID);

        mockMvc.perform(delete("/api/tours/{id}", ID))
                .andExpect(status().isNoContent());

        verify(tourService).delete(ID);
    }

    @Test
    void delete_notFound_returns404() throws Exception {
        doThrow(new TourNotFoundException(ID)).when(tourService).delete(ID);

        mockMvc.perform(delete("/api/tours/{id}", ID))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").exists());
    }

    // ── POST /api/tours/{id}/image ────────────────────────────────────────────

    @Test
    void uploadImage_validFile_returnsOk() throws Exception {
        when(tourService.uploadImage(eq(ID), any())).thenReturn(sampleDto());

        MockMultipartFile file = new MockMultipartFile(
                "file", "photo.jpg", MediaType.IMAGE_JPEG_VALUE, "fake-image-bytes".getBytes());

        mockMvc.perform(multipart("/api/tours/{id}/image", ID).file(file))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(ID.toString()));
    }

    @Test
    void uploadImage_serviceThrowsIllegalArgument_returns400() throws Exception {
        doThrow(new IllegalArgumentException("Nur Bilddateien erlaubt"))
                .when(tourService).uploadImage(eq(ID), any());

        MockMultipartFile file = new MockMultipartFile(
                "file", "doc.pdf", MediaType.APPLICATION_PDF_VALUE, "data".getBytes());

        mockMvc.perform(multipart("/api/tours/{id}/image", ID).file(file))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Nur Bilddateien erlaubt"));
    }
}
